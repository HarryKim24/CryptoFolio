type ValidationResult = {
  valid: boolean;
  message?: string;
};

const validateUserPayload = (
  email: string,
  password: string,
  name: string
): ValidationResult => {
  const isEmpty = !email || !password || !name;

  if (isEmpty) {
    return {
      valid: false,
      message: '모든 필드를 입력하세요',
    };
  }

  const nameRegex = /^[가-힣a-zA-Z]{1,8}$/;
  const isValidName = nameRegex.test(name);

  if (!isValidName) {
    return {
      valid: false,
      message: '이름은 한글 또는 영문만 사용 가능하며 8자 이내여야 합니다.',
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isValidEmail = emailRegex.test(email);

  if (!isValidEmail) {
    return {
      valid: false,
      message: '유효한 이메일 형식이 아닙니다',
    };
  }

  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/;
  const isValidPassword = passwordRegex.test(password);

  if (!isValidPassword) {
    return {
      valid: false,
      message: '비밀번호는 영문과 숫자를 포함한 8자 이상이어야 합니다',
    };
  }

  return { valid: true };
};

const validateRegisterInputs = (
  email: string,
  password: string,
  name: string,
  confirmPassword: string
): ValidationResult => {
  const baseResult = validateUserPayload(email, password, name);

  if (!baseResult.valid) {
    return baseResult;
  }

  const isConfirmEmpty = !confirmPassword;

  if (isConfirmEmpty) {
    return {
      valid: false,
      message: '모든 필드를 입력하세요',
    };
  }

  const isSamePassword = password === confirmPassword;

  if (!isSamePassword) {
    return {
      valid: false,
      message: '비밀번호가 일치하지 않습니다.',
    };
  }

  return { valid: true };
};

export { validateUserPayload, validateRegisterInputs };