import multer from "multer";
import path from "path";


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() + "-" + file.originalname.replace(/\s+/g, "_")
    );
  },
});


const fileFilter = (req, file, cb) => {
  const allowed = [
    ".zip", ".tar", ".gz", ".rar",   
    ".js", ".py", ".java", ".cpp", ".c", ".ts", 
    ".pdf", ".docx", ".txt",        
    ".jpg", ".jpeg", ".png"          
  ];
  
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error("❌ Only code files, docs, images, or compressed folders allowed"), false);
  }
};


const upload = multer({ storage, fileFilter });

export default upload;
