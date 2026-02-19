import { Box, Button, Typography } from "@mui/material";

function ReviewDataNew({ formData, handleBack, goToStep }) {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Review Your Application
      </Typography>

      <pre
        style={{ textAlign: "left", background: "#f4f4f4", padding: "1rem" }}
      >
        {JSON.stringify(formData, null, 2)}
      </pre>

      <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
        <Button variant="outlined" onClick={handleBack}>
          Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => console.log("Submitting:", formData)}
        >
          Submit
        </Button>
        <Button variant="text" onClick={() => goToStep(0)}>
          Edit Business Info
        </Button>
      </Box>
    </Box>
  );
}

export default ReviewDataNew;
