import bcrypt from "bcryptjs";

const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 12);
};

const verifyPassword = async (password: string, hashed: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashed);
};

export { hashPassword, verifyPassword };