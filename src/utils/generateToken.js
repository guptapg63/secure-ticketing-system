import jwt from 'jsonwebtoken';

/**
 * @desc    Generate a JWT token for authenticated users
 * @param   {string} id - The user database ID
 * @returns {string} Signed JWT token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

export default generateToken;