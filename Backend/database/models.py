def user_model(data):
    return {
        "username": data["username"],
        "email": data["email"],
        "password": data["password"],
        "role": data["role"]
    }

def document_model(title, content, source):
    return {
        "title": title,
        "content": content,
        "source": source
    }
