import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";

dotenv.config();

const app = express();
const prisma = new PrismaClient();
const PORT =  5000;
const JWT_SECRET = process.env.JWT_SECRET || "supersecret";

app.use(cors());
app.use(bodyParser.json());

// ---------------------- Middleware ----------------------

const authenticate = async (req:any, res:any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};

// ---------------------- Auth Routes ----------------------

app.post("/api/auth/signup", async (req:any, res:any) => {
  const { email, password } = req.body;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(400).json({ message: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });

  const token = jwt.sign({ userId: user.id }, JWT_SECRET);
  res.json({ token });
});

app.post("/api/auth/signin", async (req:any, res:any) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(400).json({ message: "User not found" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ userId: user.id }, JWT_SECRET);
  res.json({ token });
});

// ---------------------- Blog Routes ----------------------

app.post("/api/blogs/save-draft", authenticate, async (req: any, res: any) => {
  const { id, title, content, tags } = req.body;
  const tagsString = Array.isArray(tags) ? tags.join(",") : tags;

  try {
    if (id) {
      // Update existing draft
      const updated = await prisma.blog.update({
        where: { id },
        data: {
          title,
          content,
          tags: tagsString,
          status: "DRAFT",
          updatedAt: new Date(),
        },
      });
      return res.json(updated); // returns updated blog with id
    }

    // Create new draft
    const newDraft = await prisma.blog.create({
      data: {
        title: title || "Untitled",
        content: content || "",
        tags: tagsString || "",
        status: "DRAFT",
        authorId: req.user.userId,
      },
    });

    return res.json(newDraft); // return includes blog.id for frontend to store
  } catch (err) {
    console.error("Prisma error:", err instanceof Error ? err.message : JSON.stringify(err));
    return res.status(500).json({ message: "Failed to save draft" });
  }
});


app.post("/api/blogs/publish", authenticate, async (req:any, res:any) => {
  const { id, title, content, tags } = req.body;

  try {
    if (id) {
      const updated = await prisma.blog.update({
        where: { id },
        data: {
          title,
          content,
          tags,
          status: "PUBLISHED",
          updatedAt: new Date(),
        },
      });
      return res.json(updated);
    }

    const newBlog = await prisma.blog.create({
      data: {
        title,
        content,
        tags,
        status: "PUBLISHED",
        authorId: req.user.userId,
      },
    });
    res.json(newBlog);
  } catch (err) {
    res.status(500).json({ message: "Failed to publish blog" });
  }
});

app.get("/api/blogs", authenticate, async (req: any, res:any) => {
  try {
    const blogs = await prisma.blog.findMany({
      where: {
        authorId: req.user.userId,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch blogs" });
  }
});

app.get("/api/blogs/:id", authenticate, async (req:any, res:any) => {
  const blogId = Number(req.params.id);
  try {
    const blog = await prisma.blog.findUnique({
      where: { id: blogId },
    });

    if (!blog || blog.authorId !== req.user.userId) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json(blog);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch blog" });
  }
});

app.get("/api/blogs/view/:id",authenticate, async (req:any, res:any) => {
  const blogId = Number(req.params.id);

  if (isNaN(blogId)) {
    return res.status(400).json({ message: "Invalid blog ID" });
  }

  try {
    const blog = await prisma.blog.findUnique({
      where: { id: blogId },
    });

    if (!blog || blog.status !== "PUBLISHED") {
      return res.status(404).json({ message: "Blog not found or not published" });
    }

    res.json(blog);
  } catch (err) {
    console.error("Failed to fetch blog:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


// ---------------------- Start Server ----------------------

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
