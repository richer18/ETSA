import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Col,
  Container,
  Form,
  Row,
  Table,
} from "react-bootstrap";
import axiosInstance from "../../../../../api/axiosInstance";

const cashier = [
  "Please select",
  "FLORA MY",
  "IRIS",
  "RICARDO",
  "AGNES",
  "AMABELLA",
];

function Index() {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedCashier, setSelectedCashier] = useState("");
  const [startMonth, setStartMonth] = useState("");
  const [endMonth, setEndMonth] = useState("");
  const [monthList, setMonthList] = useState([]);
  const [paymentMode, setPaymentMode] = useState("monthly");
  const [totalPay, setTotalPay] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);

  // 🔹 For account search
  const [accountInput, setAccountInput] = useState("");
  const [taxpayerName, setTaxpayerName] = useState("");
  const [filteredList, setFilteredList] = useState([]);
  const [accounts, setAccounts] = useState([]);

  // 🔹 Current selected account details
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [message, setMessage] = useState("");

  const overall = parseFloat(totalPay || 0) + parseFloat(totalInterest || 0);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const res = await axiosInstance.get("accounts");
        setAccounts(res.data);
      } catch (err) {
        console.error("Error fetching accounts:", err);
      }
    };

    fetchAccounts();
  }, []);

  const generateMonths = () => {
    if (!startMonth || !endMonth) return;

    const start = dayjs(startMonth);
    const end = dayjs(endMonth);

    const months = [];
    let current = start;

    while (current.isBefore(end) || current.isSame(end, "month")) {
      months.push(current.format("YYYY-MM"));
      current = current.add(1, "month");
    }

    setMonthList(months);
  };

  const handleAccountSearch = (e) => {
    const value = e.target.value;
    setAccountInput(value);

    if (value.length > 0) {
      const results = accounts.filter(
        (cust) =>
          cust.accountNumber.includes(value) ||
          cust.fullName.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredList(results);
    } else {
      setFilteredList([]);
    }
  };

  const handleSelectCustomer = async (customer) => {
    setAccountInput(customer.accountNumber);
    setTaxpayerName(customer.fullName);
    setFilteredList([]);

    try {
      // Fetch full account details
      const res = await axiosInstance.get(`/account/${customer.accountNumber}`);
      setSelectedAccount(res.data);
    } catch (err) {
      console.error("Error fetching account:", err);
    }
  };

  const handlePayMeter = async () => {
    if (!selectedAccount) return;
    const amount = prompt("Enter amount to pay for Water Meter:");
    if (!amount) return;

    try {
      const res = await axiosInstance.post(
        `/account/${selectedAccount.accountNumber}/pay`,
        {
          type: "meter",
          amount: parseFloat(amount),
        }
      );

      setSelectedAccount(res.data.account);
      setMessage("Water meter payment recorded!");
    } catch (err) {
      if (err.response) {
        setMessage(err.response.data.message || "Payment failed.");
      } else {
        console.error("Payment failed:", err);
        setMessage("Payment failed.");
      }
    }
  };

  return (
    <Container>
      <Row className="g-3 mb-4">
        {/* Date */}
        <Col md={12}>
          <Form.Group controlId="formDate">
            <Form.Label>Date</Form.Label>
            <Form.Control
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              required
            />
          </Form.Group>
        </Col>

        {/* Account Number Search */}
        <Col md={12} style={{ position: "relative" }}>
          <Form.Group controlId="formAccountNumber">
            <Form.Label>Account Number</Form.Label>
            <Form.Control
              type="text"
              value={accountInput}
              onChange={handleAccountSearch}
              autoComplete="off"
              required
            />
          </Form.Group>

          {filteredList.length > 0 && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                background: "white",
                border: "1px solid #ddd",
                zIndex: 1000,
                maxHeight: "200px",
                overflowY: "auto",
              }}
            >
              {filteredList.map((cust) => (
                <div
                  key={cust.accountNumber}
                  style={{
                    padding: "8px",
                    cursor: "pointer",
                    borderBottom: "1px solid #eee",
                  }}
                  onClick={() => handleSelectCustomer(cust)}
                >
                  {cust.fullName} – {cust.accountNumber}
                </div>
              ))}
            </div>
          )}
        </Col>

        {/* Auto-filled Name */}
        <Col md={12}>
          <Form.Group controlId="formTaxpayerName">
            <Form.Label>NAME OF TAXPAYER</Form.Label>
            <Form.Control type="text" value={taxpayerName} readOnly required />
          </Form.Group>
        </Col>

        {/* Show Account Details */}
        {selectedAccount && (
          <Col md={12}>
            <div className="p-3 border rounded bg-light">
              <p>
                <strong>Water Meter Balance:</strong> ₱
                {selectedAccount?.meterBalance !== undefined
                  ? Number(selectedAccount.meterBalance).toFixed(2)
                  : "0.00"}
              </p>
              <Button
                variant="primary"
                size="sm"
                onClick={handlePayMeter}
                disabled={selectedAccount.meterBalance <= 0}
              >
                Pay Water Meter
              </Button>

              <hr />
              <h6>Previous Payments</h6>
              {selectedAccount.payments.length > 0 ? (
                <Table striped bordered size="sm">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Type</th>
                      <th>Amount</th>
                      <th>Month</th>
                      <th>Usage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedAccount.payments.map((p, idx) => (
                      <tr key={idx}>
                        <td>{dayjs(p.date).format("YYYY-MM-DD")}</td>
                        <td>{p.type}</td>
                        <td>₱{p.amount}</td>
                        <td>{p.month || "-"}</td>
                        <td>{p.usage || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p>No payments yet.</p>
              )}
            </div>
          </Col>
        )}

        {message && (
          <Col md={12}>
            <Alert variant="info">{message}</Alert>
          </Col>
        )}

        {/* Receipt */}
        <Col md={12}>
          <Form.Group controlId="formReceipt">
            <Form.Label>RECEIPT NO. P.F. NO. 25(A)</Form.Label>
            <Form.Control type="text" required />
          </Form.Group>
        </Col>

        {/* Cashier */}
        <Col md={12}>
          <Form.Group controlId="formCashier">
            <Form.Label>Select Cashier</Form.Label>
            <Form.Select
              value={selectedCashier}
              onChange={(e) => setSelectedCashier(e.target.value)}
              required
            >
              {cashier.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>

        {/* Show after selecting cashier */}
        {selectedCashier && (
          <>
            <Col md={6}>
              <Form.Group controlId="formStartMonth">
                <Form.Label>Start Month</Form.Label>
                <Form.Control
                  type="month"
                  value={startMonth}
                  onChange={(e) => setStartMonth(e.target.value)}
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="formEndMonth">
                <Form.Label>End Month</Form.Label>
                <Form.Control
                  type="month"
                  value={endMonth}
                  onChange={(e) => setEndMonth(e.target.value)}
                  onBlur={generateMonths}
                />
              </Form.Group>
            </Col>

            {/* Payment Mode Toggle */}
            <Col md={12}>
              <Form.Group controlId="formPaymentMode">
                <Form.Label>Payment Mode</Form.Label>
                <Form.Select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value)}
                >
                  <option value="monthly">Pay Monthly</option>
                  <option value="full">Pay Full (One-Time)</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </>
        )}

        {/* Show per-month inputs if mode is "monthly" */}
        {paymentMode === "monthly" &&
          monthList.length > 0 &&
          monthList.map((month, index) => (
            <React.Fragment key={month}>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>{dayjs(month).format("MMMM YYYY")}</Form.Label>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId={`payment-${index}`}>
                  <Form.Label>Payment</Form.Label>
                  <Form.Control type="number" min="0" step="0.01" />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group controlId={`usage-${index}`}>
                  <Form.Label>Water Usage (m³)</Form.Label>
                  <Form.Control type="number" min="0" step="0.01" />
                </Form.Group>
              </Col>
            </React.Fragment>
          ))}

        {/* Show total inputs if mode is "full" */}
        {paymentMode === "full" && monthList.length > 0 && (
          <>
            <Col md={6}>
              <Form.Group controlId="totalPayment">
                <Form.Label>Total Payment Amount</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  step="0.01"
                  value={totalPay}
                  onChange={(e) => setTotalPay(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={6}>
              <Form.Group controlId="totalInterest">
                <Form.Label>Total Interest</Form.Label>
                <Form.Control
                  type="number"
                  min="0"
                  step="0.01"
                  value={totalInterest}
                  onChange={(e) => setTotalInterest(e.target.value)}
                  required
                />
              </Form.Group>
            </Col>

            <Col md={12}>
              <div className="mt-3 p-3 border rounded bg-light">
                <strong>TOTAL PAY:</strong> ₱
                {parseFloat(totalPay || 0).toFixed(2)} <br />
                <strong>INTEREST:</strong> ₱
                {parseFloat(totalInterest || 0).toFixed(2)} <br />
                <strong>OVERALL:</strong>{" "}
                <span className="text-primary fw-bold">
                  ₱{overall.toFixed(2)}
                </span>
              </div>
            </Col>
          </>
        )}
      </Row>
    </Container>
  );
}

export default Index;
