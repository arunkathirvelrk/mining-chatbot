import os
from fastapi import APIRouter, UploadFile, File, Form
from services.pdf_extractor import extract_text_from_pdf
from database.crud import save_document

router = APIRouter()
UPLOAD_DIR = "uploads/pdfs"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
def upload_pdf(
    title: str = Form(...),
    source: str = Form(...),
    file: UploadFile = File(...)
):
    path = f"{UPLOAD_DIR}/{file.filename}"
    with open(path, "wb") as f:
        f.write(file.file.read())

    content = extract_text_from_pdf(path)
    save_document({"title": title, "content": content, "source": source})

    return {"message": "PDF uploaded and processed"}
