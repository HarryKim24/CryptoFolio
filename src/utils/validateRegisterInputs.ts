export const validateRegisterInputs = (
  email: string,
  password: string,
  name: string,
  confirmPassword: string
): { valid: boolean; message?: string } => {
  if (!email || !password || !name || !confirmPassword) {
    return { valid: false, message: "모든 필드를 입력하세요." };
  }

  const nameRegex = /^[가-힣a-zA-Z]{1,8}$/;
  if (!nameRegex.test(name)) {
    return { valid: false, message: "이름은 한글 또는 영문만 사용 가능하며 8자 이내여야 합니다." };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, message: "유효한 이메일 형식을 입력하세요." };
  }

  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;
  if (!passwordRegex.test(password)) {
    return { valid: false, message: "비밀번호는 영문과 숫자를 포함한 8자 이상이어야 합니다." };
  }

  if (password !== confirmPassword) {
    return { valid: false, message: "비밀번호가 일치하지 않습니다." };
  }

  return { valid: true };
};