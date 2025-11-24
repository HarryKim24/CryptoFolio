import bcrypt from "bcryptjs";

const SALT_ROUNDS = 12;

const hashPassword = (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

const verifyPassword = (password: string, hashed: string): Promise<boolean> => {
  return bcrypt.compare(password, hashed);
};

export { hashPassword, verifyPassword };