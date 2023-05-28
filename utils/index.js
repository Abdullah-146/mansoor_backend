import bcrypt from 'bcrypt';

/**
 * this function returns encrypted str
 * @param {*} str
 * @param {*} saltRounds
 * @returns string
 */
const encrypt = async (str, saltRounds = 10) => {
  try {
    return await bcrypt.hash(str, saltRounds);
  } catch (error) {
    console.log('Error while encrypting str...');
    return '';
  }
};

/**
 * this function compares plainString with hash and returns boolean value
 * @param {*} plainStr
 * @param {*} hash
 * @returns boolean
 */
const compare = async (plainStr, hash) => {
  try {
    return await bcrypt.compare(plainStr, hash);
  } catch (error) {
    throw new Error('Error has been occured while comparing hash');
  }
};

export { encrypt, compare };
