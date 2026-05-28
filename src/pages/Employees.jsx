import {
    deleteEmployee as deleteEmployeeApi,
    getAllEmployees,
    updateEmployee as updateEmployeeApi,
} from "../services/employeeService";

import { Edit2, Mail, Trash2, User, Users, X } from "lucide-react";
import { useEffect, useState } from "react";
import ConfirmModal from "../components/ConfirmModal";
import NotificationToast from "../components/NotificationToast";
import { useUser } from "../contexts/UserContext";

const Employees = ({ searchQuery = "" }) => {
  const { currentUser } = useUser();

  const [employees, setEmployees] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [employeeFormData, setEmployeeFormData] = useState({
    name: "",
    email: "",
    designation: "",
    role: "employee",
  });

  const [editingEmployee, setEditingEmployee] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] =
    useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [notification, setNotification] = useState("");
  const [notificationType, setNotificationType] =
    useState("success");
  const [showNotification, setShowNotification] =
    useState(false);
  const isTeamLead = currentUser?.role === "team-lead";

  const formatRole = (role) => {
    if (!role) return '';
    const r = String(role).toLowerCase();
    if (r.includes('team')) return 'Team Lead';
    if (r.includes('admin')) return 'Admin';
    return 'Employee';
  };

  // FETCH EMPLOYEES
  const fetchEmployees = async () => {
    try {
      const response = await getAllEmployees();

      console.log(response.data);

      const payload = response.data && response.data.data ? response.data.data : response.data;

      // Handle paginated response: Page<Employee> may be in payload.content
      if (payload && Array.isArray(payload)) {
        setEmployees(payload);
      } else if (payload && Array.isArray(payload.content)) {
        setEmployees(payload.content);
      } else if (payload && Array.isArray(payload.items)) {
        setEmployees(payload.items);
      } else {
        // fallback: try to use payload directly if it's an array-like
        setEmployees(payload || []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const filteredEmployees = employees.filter((employee) => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return true;

    return (
      employee.name?.toLowerCase().includes(query) ||
      employee.email?.toLowerCase().includes(query) ||
      employee.designation?.toLowerCase().includes(query) ||
      employee.role?.toLowerCase().includes(query) ||
      employee.employeeId?.toLowerCase().includes(query)
    );
  });

  const showNotificationMessage = (type, message) => {
    setNotificationType(type);
    setNotification(message);
    setShowNotification(true);
  };

  const handleEmployeeFormChange = (e) => {
    const { name, value } = e.target;

    setEmployeeFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);

    setEmployeeFormData({
      name: employee.name,
      email: employee.email,
      designation: employee.designation || "",
      role:
        (employee.role === "TEAM_LEAD" || employee.role === 'TEAM-LEAD' || employee.role === 'team-lead')
          ? "team-lead"
          : "employee",
    });

    setShowCreateForm(true);
  };

  // UPDATE EMPLOYEE
  const handleUpdateEmployee = async (e) => {
    e.preventDefault();

    try {
      // Use employeeId (external id) for update endpoint per backend API
      await updateEmployeeApi(editingEmployee.employeeId || editingEmployee.id, {
        name: employeeFormData.name,
        email: employeeFormData.email,
        designation: employeeFormData.designation,
        role:
          employeeFormData.role === "team-lead"
            ? "TEAM_LEAD"
            : "EMPLOYEE",
      });

      fetchEmployees();

      showNotificationMessage(
        "success",
        "Employee updated successfully"
      );

      closeCreateForm();
    } catch (error) {
      console.log(error);

      showNotificationMessage(
        "error",
        "Failed to update employee"
      );
    }
  };

  const handleDeleteEmployee = (employeeId) => {
    const employee = employees.find(
      (emp) => emp.id === employeeId
    );

    if (!employee) return;

    setEmployeeToDelete(employee);

    setShowDeleteConfirmation(true);
  };

  // DELETE EMPLOYEE
  const confirmDeleteEmployee = async () => {
    try {
      await deleteEmployeeApi(employeeToDelete.id);

      fetchEmployees();

      showNotificationMessage(
        "success",
        "Employee deleted successfully"
      );

      setShowDeleteConfirmation(false);

      setEmployeeToDelete(null);
    } catch (error) {
      console.log(error);

      showNotificationMessage(
        "error",
        "Failed to delete employee"
      );
    }
  };

  const resetEmployeeForm = () => {
    setEmployeeFormData({
      name: "",
      email: "",
      designation: "",
      role: "employee",
    });
  };

  const closeCreateForm = () => {
    setShowCreateForm(false);

    setEditingEmployee(null);

    resetEmployeeForm();
  };

  return (
    <div className="space-y-4 sm:space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            👥 Employee Directory
          </h1>

          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
            View all registered employees
          </p>
        </div>
      </div>

      {/* Employee Cards */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4">

        {filteredEmployees.map((employee) => (
          <div
            key={employee.id}
            className="bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 p-4"
          >
            <div className="flex justify-between items-start">

              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                  {employee.name}
                </h2>

                <p className="text-sm text-gray-500">
                  {employee.employeeId}
                </p>

                <div className="mt-2 space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail size={14} />
                    {employee.email}
                  </div>

                  <div>
                    {employee.designation}
                  </div>

                  <div className="flex items-center gap-2">
                    <User size={14} />
                    {formatRole(employee.role)}
                  </div>
                </div>
              </div>

              {isTeamLead && (
                <div className="flex gap-2">

                  <button
                    onClick={() =>
                      handleEditEmployee(employee)
                    }
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <Edit2 size={18} />
                  </button>

                  <button
                    onClick={() =>
                      handleDeleteEmployee(employee.id)
                    }
                    className="p-2 hover:bg-red-100 rounded-lg text-red-600"
                  >
                    <Trash2 size={18} />
                  </button>

                </div>
              )}
            </div>
          </div>
        ))}

      </div>

      {/* Empty State */}
      {filteredEmployees.length === 0 && (
        <div className="bg-white dark:bg-dark-800 rounded-lg p-10 text-center">
          <Users
            size={40}
            className="mx-auto text-gray-400 mb-4"
          />

          <h3 className="text-lg font-semibold">
            No employees found
          </h3>
        </div>
      )}

      {/* Edit Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

          <div className="bg-white dark:bg-dark-800 rounded-xl w-full max-w-lg">

            <div className="flex items-center justify-between p-6 border-b">

              <h2 className="text-xl font-bold">
                Edit Employee
              </h2>

              <button onClick={closeCreateForm}>
                <X size={20} />
              </button>

            </div>

            <form
              onSubmit={handleUpdateEmployee}
              className="p-6 space-y-4"
            >

              <input
                type="text"
                name="name"
                value={employeeFormData.name}
                onChange={handleEmployeeFormChange}
                placeholder="Name"
                className="w-full border rounded-lg px-4 py-2"
              />

              <input
                type="email"
                name="email"
                value={employeeFormData.email}
                onChange={handleEmployeeFormChange}
                placeholder="Email"
                className="w-full border rounded-lg px-4 py-2"
              />

              <input
                type="text"
                name="designation"
                value={employeeFormData.designation}
                onChange={handleEmployeeFormChange}
                placeholder="Designation"
                className="w-full border rounded-lg px-4 py-2"
              />

              <select
                name="role"
                value={employeeFormData.role}
                onChange={handleEmployeeFormChange}
                className="w-full border rounded-lg px-4 py-2"
              >
                <option value="employee">
                  Employee
                </option>

                <option value="team-lead">
                  Team Lead
                </option>
              </select>

              <div className="flex gap-3 pt-4">

                <button
                  type="button"
                  onClick={closeCreateForm}
                  className="flex-1 border rounded-lg py-2"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 bg-primary-600 text-white rounded-lg py-2"
                >
                  Update Employee
                </button>

              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={showDeleteConfirmation}
        title="Delete Employee"
        description={
          employeeToDelete
            ? `Are you sure you want to delete ${employeeToDelete.name}?`
            : ""
        }
        confirmText="Delete"
        cancelText="Cancel"
        onCancel={() => {
          setShowDeleteConfirmation(false);
          setEmployeeToDelete(null);
        }}
        onConfirm={confirmDeleteEmployee}
      />

      {/* Toast */}
      <NotificationToast
        type={notificationType}
        message={notification}
        isOpen={showNotification}
        onClose={() => setShowNotification(false)}
      />
    </div>
  );
};

export default Employees;
