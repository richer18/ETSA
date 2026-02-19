import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import axiosInstance from "../../../../../api/axiosInstance";
const RegisterIndex = forwardRef(({ onSave }, ref) => {
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    lastName: "",
    firstName: "",
    middleName: "",
    purok: "",
    street: "",
    barangay: "",
    municipality: "Zamboanguita",
    province: "Negros Oriental",
    phone: "",
    email: "",
    idNumber: "",
    waterMeter: "",
    waterConnectionType: "Residential",
    accountNumber: "",
    meterBalance: "", // 👈 added for manual fee
  });

  // Auto-generate account number
  useEffect(() => {
    const year = new Date().getFullYear();
    const prefix = `25${year}`;
    const randomDigits = Math.floor(
      Math.random() * Math.pow(10, 16 - prefix.length)
    )
      .toString()
      .padStart(16 - prefix.length, "0");

    setFormData((prev) => ({
      ...prev,
      accountNumber: prefix + randomDigits,
    }));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Save to backend
  const handleSave = async () => {
    try {
      const res = await axiosInstance.post("/register", formData);

      alert(res.data.message);
      setError("");
      if (onSave) onSave();
    } catch (err) {
      if (err.response) {
        // Server responded with an error
        if (err.response.status === 400) {
          setError(err.response.data.message); // duplicate water meter error
        } else {
          alert("Error saving registration");
        }
      } else {
        console.error("Save failed:", err);
        alert("Error saving registration");
      }
    }
  };

  useImperativeHandle(ref, () => ({
    handleSave,
  }));

  return (
    <Form>
      {/* Name Section */}
      <h6 className="mt-2">Name</h6>
      <Row className="mb-3">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Middle Name</Form.Label>
            <Form.Control
              type="text"
              name="middleName"
              value={formData.middleName}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
      </Row>

      {/* Address */}
      <h6 className="mt-3">Address</h6>
      <Form.Group className="mb-3">
        <Form.Label>Purok</Form.Label>
        <Form.Control
          type="text"
          name="purok"
          value={formData.purok}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Street</Form.Label>
        <Form.Control
          type="text"
          name="street"
          value={formData.street}
          onChange={handleChange}
          required
        />
      </Form.Group>

      <Row className="mb-3">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Barangay</Form.Label>
            <Form.Select
              name="barangay"
              value={formData.barangay}
              onChange={handleChange}
              required
            >
              <option value="">Select Barangay</option>
              <option value="Basak (Basac)">Basak (Basac)</option>
              <option value="Calango">Calango</option>
              <option value="Lutoban (Lotuban)">Lutoban (Lotuban)</option>
              <option value="Malongcay Diot">Malongcay Diot</option>
              <option value="Maluay">Maluay</option>
              <option value="Mayabon">Mayabon</option>
              <option value="Nabago">Nabago</option>
              <option value="Nasig-id">Nasig-id</option>
              <option value="Najandig">Najandig</option>
              <option value="Poblacion">Poblacion</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Municipality</Form.Label>
            <Form.Control
              type="text"
              name="municipality"
              value={formData.municipality}
              readOnly
            />
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Province</Form.Label>
            <Form.Control
              type="text"
              name="province"
              value={formData.province}
              readOnly
            />
          </Form.Group>
        </Col>
      </Row>

      {/* Contact */}
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Phone Number</Form.Label>
            <Form.Control
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>
      </Row>

      {/* ID + Water Meter */}
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>ID Number</Form.Label>
            <Form.Control
              type="text"
              name="idNumber"
              value={formData.idNumber}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Water Meter Number</Form.Label>
            <Form.Control
              type="text"
              name="waterMeter"
              value={formData.waterMeter}
              onChange={handleChange}
              isInvalid={!!error}
              required
            />
            <Form.Control.Feedback type="invalid">
              {error}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      {/* ✅ Water Meter Fee */}
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Water Meter Fee (₱)</Form.Label>
            <Form.Control
              type="number"
              name="meterBalance"
              value={formData.meterBalance}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Col>
      </Row>

      {/* Connection + Account */}
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>Connection Type</Form.Label>
            <Form.Select
              name="waterConnectionType"
              value={formData.waterConnectionType}
              onChange={handleChange}
            >
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
              <option value="Industrial">Industrial</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Account Number</Form.Label>
            <Form.Control
              type="text"
              name="accountNumber"
              value={formData.accountNumber}
              readOnly
            />
          </Form.Group>
        </Col>
      </Row>
    </Form>
  );
});

export default RegisterIndex;
