import { DataTypes, Model } from "sequelize";
import { compareSync } from "../util/encrypt";
import sequelizeConnection from "../db/connection";
import { ROLES } from "../config/consts";

class User extends Model {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public role!: ROLES;

  // user heirarchy

  public superAdminId!: number;
  public branchManagerId!: number;
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
// user hierarchy
User.hasMany(User, {
  as: "BranchManagers",
  foreignKey: "superAdminId",
  onDelete: "SET NULL",
});
User.belongsTo(User, { as: "SuperAdmin", foreignKey: "superAdminId" });

User.hasMany(User, {
  as: "Salespersons",
  foreignKey: "branchManagerId",
  onDelete: "SET NULL",
});
User.belongsTo(User, { as: "BranchManager", foreignKey: "branchManagerId" });

export default User;
