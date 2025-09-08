// middleware/upload.js
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // make sure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_"));
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = [
  ".zip", ".tar", ".gz", ".rar",
  ".js", ".jsx", ".ts", ".tsx", ".py", ".java", ".cpp", ".c",
  ".html", ".css", ".json", ".md",
  ".pdf", ".docx", ".txt",
  ".jpg", ".jpeg", ".png"
];

  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) cb(null, true);
  else cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname));
};

const upload = multer({ storage, fileFilter });

export default upload;
