import { DataTypes, Model } from "sequelize";
import { compareSync } from "../util/encrypt";
import sequelizeConnection from "../db/connection";

class User extends Model {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;

  // timestamps!
  public readonly created_at!: Date;
  public readonly last_updated!: Date;

  static validPassword: (password: string, hash: string) => boolean;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.ENUM("SUPERADMIN", "BRANCHMANAGER", "SALESPERSON"),
      allowNull: false,
      defaultValue: "SALESPERSON",
    },
  },
  {
    sequelize: sequelizeConnection,
    tableName: "users",
    createdAt: "created_at",
    updatedAt: "last_updated",
  }
);

User.validPassword = (password: string, hash: string) => {
  return compareSync(password, hash);
};

// Relationship
// user heirarchy
User.hasMany(User, { as: "BranchManagers", foreignKey: "superAdminId" });
User.belongsTo(User, { as: "SuperAdmin", foreignKey: "superAdminId" });

User.hasMany(User, { as: "Salespersons", foreignKey: "branchManagerId" });
User.belongsTo(User, { as: "BranchManager", foreignKey: "branchManagerId" });

export default User;
