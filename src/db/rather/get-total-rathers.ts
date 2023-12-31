import db from "~/db";

export const getTotalRathers = () => {
  return db.rather.count({
    where: {
      isDeleted: false,
    },
  });
};
