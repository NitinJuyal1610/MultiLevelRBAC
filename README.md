# RBAC Implementation

## Hierarchy

### SuperAdmin
- Highest authority.
- Manages Branch Managers and Salespersons.
- Can perform actions globally.

### Branch Manager
- Belongs to a SuperAdmin.
- Manages Salespersons within a branch.
- Limited to actions within their branch.

### Salesperson
- Belongs to a Branch Manager and SuperAdmin.
- Operates within a specific branch.
- Limited permissions, managed by a Branch Manager.

## Documentation URL 
 https://documenter.getpostman.com/view/21567688/2s9YsKhCZB

## AWS Deployed URL
  http://54.175.102.207/api/
