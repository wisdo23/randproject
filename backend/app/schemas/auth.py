from pydantic import BaseModel, EmailStr, constr


class ManagerCreate(BaseModel):
    email: EmailStr
    password: constr(min_length=6, max_length=72)
    phone: str | None = None


class ManagerLogin(BaseModel):
    email: EmailStr
    password: constr(min_length=6, max_length=72)


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class GoogleAuthRequest(BaseModel):
    id_token: str
