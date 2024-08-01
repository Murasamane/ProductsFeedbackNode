exports.generateMongoLikeId = () => {
  const timestamp = Math.floor(Date.now() / 1000).toString(36); // Timestamp in base 36
  const randomString = Array(16)
    .fill(null)
    .map(() => Math.floor(Math.random() * 36).toString(36))
    .join("");
  return `${timestamp}${randomString}`;
};
