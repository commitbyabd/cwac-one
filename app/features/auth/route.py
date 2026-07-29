from fastapi import APIRouter, Depends, HTTPException, status

from app.core.security import create_access_token
from app.dependencies.auth import get_current_user, require_role
from app.schemas.user_signup import UserLogin

from .v1.signup_bundle import login_api

# tags is used to group this route in authentication in swagger ui documentation
router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login")
async def login(login_data: UserLogin):
    user = await login_api(
        login_data.email,
        # this is used in pydantic to not log the password
        login_data.password.get_secret_value(),
    )

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    token = create_access_token(user_id=str(user["_id"]), role=user["role"])

    return {
        "access_token": token,
        "token_type": "bearer",
        "role": user["role"],
    }


# Any logged-in user, whatever their role — proves authentication works.
@router.get("/me")
async def me(current_user: dict = Depends(get_current_user)):
    return current_user


# Admins only — proves authorization works on top of authentication.
@router.get("/admin-only")
async def admin_only(current_user: dict = Depends(require_role("admin"))):
    return {"message": f"Hello admin {current_user['full_name']}"}
