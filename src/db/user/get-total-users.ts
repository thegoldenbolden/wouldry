import db from "~/db";

export const getTotalUsers = () => {
  return db.user.count({
    where: {
      isDeleted: false,
    },
  });
};
