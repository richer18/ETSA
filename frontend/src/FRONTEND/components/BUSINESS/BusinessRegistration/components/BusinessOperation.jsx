import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { useAddressContext } from "./AddressContext";

// Sample barangays + zipCodes (replace with backend JSON)
const zipCodes = {
  Amlan: "6203",
  Ayungon: "6210",
  Bacong: "6209",
  Bais: "6206",
  Basay: "6221",
  Bayawan: "6221",
  Bindoy: "6209",
  Canlaon: "6223",
  Dauin: "6217",
  Dumaguete: "6200",
  Guihulngan: "6214",
  Jimalalud: "6212",
  "La Libertad": "6213",
  Mabinay: "6207",
  Manjuyod: "6208",
  Pamplona: "6205",
  "San Jose": "6202",
  "Santa Catalina": "6220",
  Siaton: "6219",
  Sibulan: "6201",
  Tanjay: "6204",
  Tayasan: "6211",
  Valencia: "6215",
  Vallehermoso: "6213",
  Zamboanguita: "6218",
  Bago: "6101",
  Binalbagan: "6107",
  Cadiz: "6121",
  Calatrava: "6126",
  Candoni: "6110",
  Cauayan: "6112",
  "Enrique B. Magalona": "6118",
  Escalante: "6124",
  Himamaylan: "6108",
  Hinigaran: "6106",
  "Hinoba-an": "6114",
  Ilog: "6109",
  Isabela: "6111",
  Kabankalan: "6111",
  "La Carlota": "6130",
  "La Castellana": "6131",
  Manapla: "6110",
  "Moises Padilla": "6132",
  Murcia: "6129",
  Pontevedra: "6105",
  Pulupandan: "6102",
  Sagay: "6122",
  "Salvador Benedicto": "6103",
  "San Carlos": "6127",
  "San Enrique": "6104",
  Silay: "6116",
  Sipalay: "6113",
  Talisay: "6115",
  Toboso: "6125",
  Valladolid: "6103",
  Victorias: "6119",
};

const barangays = {
  Zamboanguita: [
    "Basak (Basac)",
    "Calango",
    "Lutoban (Lotuban)",
    "Malongcay Diot",
    "Maluay",
    "Mayabon",
    "Nabago",
    "Najandig",
    "Nasig-id",
    "Poblacion",
  ],
  // More arrays for other municipalities, if needed...
};

// Yup validation schema
const schema = yup.object().shape({
  floorArea: yup.string().required("Required"),
  employeesWithinResidence: yup.string(),
  maleEmployees: yup.string(),
  femaleEmployees: yup.string(),
  vehicles: yup.object().shape({
    van: yup.string(),
    motorcycle: yup.string(),
    truck: yup.string(),
  }),
  taxpayerAddress: yup.object().shape({
    region: yup.string().required("Region required"),
    province: yup.string().required("Province required"),
    municipality: yup.string().required("Municipality required"),
    barangay: yup.string().required("Barangay required"),
    addressDetails: yup.string(),
    zipCode: yup.string(),
  }),
});

function BusinessOperation({ data = {}, updateData, handleNext, handleBack }) {
  const { businessAddress } = useAddressContext();

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      floorArea: data?.floorArea || "",
      employeesWithinResidence: data?.employeesWithinResidence || "",
      maleEmployees: data?.maleEmployees || "",
      femaleEmployees: data?.femaleEmployees || "",
      vehicles: data?.vehicles || { van: "", motorcycle: "", truck: "" },
      taxpayerAddress: data?.taxpayerAddress || {
        region: "",
        province: "",
        municipality: "",
        barangay: "",
        addressDetails: "",
        zipCode: "",
      },
      sameAsBusiness: data?.sameAsBusiness || false, // ✅ add this
    },
  });

  const sameAsBusiness = watch("sameAsBusiness");
  const taxpayerAddress = watch("taxpayerAddress");

  // Copy business address if checkbox checked
  useEffect(() => {
    if (sameAsBusiness && businessAddress) {
      setValue("taxpayerAddress", {
        region: businessAddress.region || "",
        province: businessAddress.province || "",
        municipality: businessAddress.municipality || "",
        barangay: businessAddress.barangay || "",
        addressDetails: businessAddress.addressDetails || "",
        zipCode: businessAddress.zipCode || "",
      });
    }
  }, [sameAsBusiness, businessAddress, setValue]);

  // Auto update ZIP when municipality changes
  useEffect(() => {
    if (taxpayerAddress?.municipality) {
      setValue(
        "taxpayerAddress.zipCode",
        zipCodes[taxpayerAddress.municipality] || ""
      );
    }
  }, [taxpayerAddress?.municipality, setValue]);

  const onSubmit = (formValues) => {
    updateData(formValues); // Save to parent
    if (handleNext) handleNext();
  };

  return (
    <Box
      sx={{
        backgroundColor: "#ffffff",
        backgroundImage:
          'url("https://ucarecdn.com/4594b137-724c-4041-a614-43a973a69812/")',
        backgroundRepeat: "repeat-x",
        backgroundPosition: "left bottom",
        minHeight: "650px",
        padding: "2rem",
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* ---------- Business Operation ---------- */}
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", color: "#1976d2", mb: 2 }}
        >
          Business Operation
        </Typography>
        <Stack spacing={2} mb={4}>
          <Stack direction="row" spacing={2}>
            <Controller
              name="floorArea"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Business Area/Total Floor Area (sq.m)"
                  fullWidth
                  error={!!errors.floorArea}
                  helperText={errors.floorArea?.message}
                />
              )}
            />
            <Controller
              name="employeesWithinResidence"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Employees Within Residence"
                  fullWidth
                />
              )}
            />
            <Controller
              name="maleEmployees"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Male Employees" fullWidth />
              )}
            />
          </Stack>
          <Controller
            name="femaleEmployees"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Female Employees" fullWidth />
            )}
          />
        </Stack>

        {/* ---------- Vehicles ---------- */}
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", color: "#1976d2", mb: 2 }}
        >
          No. of Delivery Vehicles
        </Typography>
        <Stack direction="row" spacing={2} mb={4}>
          <Controller
            name="vehicles.van"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Van" fullWidth />
            )}
          />
          <Controller
            name="vehicles.motorcycle"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Motorcycle" fullWidth />
            )}
          />
          <Controller
            name="vehicles.truck"
            control={control}
            render={({ field }) => (
              <TextField {...field} label="Truck" fullWidth />
            )}
          />
        </Stack>

        {/* ---------- Taxpayer Address ---------- */}
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", color: "#1976d2", mb: 2 }}
        >
          Taxpayer's Address
        </Typography>

        <Controller
          name="sameAsBusiness"
          control={control}
          render={({ field }) => (
            <FormControlLabel
              control={
                <Checkbox
                  {...field}
                  checked={field.value}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    field.onChange(checked);

                    if (checked) {
                      setValue("taxpayerAddress", {
                        region: businessAddress.region || "",
                        province: businessAddress.province || "",
                        municipality: businessAddress.municipality || "",
                        barangay: businessAddress.barangay || "",
                        addressDetails: businessAddress.addressDetails || "",
                        zipCode: businessAddress.zipCode || "",
                      });
                    } else {
                      setValue("taxpayerAddress", {
                        region: "",
                        province: "",
                        municipality: "",
                        barangay: "",
                        addressDetails: "",
                        zipCode: "",
                      });
                    }
                  }}
                />
              }
              label="Same as Business Address"
            />
          )}
        />

        <Row className="g-3 mb-4">
          <Col>
            <Controller
              name="taxpayerAddress.region"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth error={!!errors.taxpayerAddress?.region}>
                  <InputLabel>Region</InputLabel>
                  <Select {...field} label="Region">
                    <MenuItem value="NegrosIsland">
                      Negros Island Region
                    </MenuItem>
                  </Select>
                </FormControl>
              )}
            />
          </Col>
          <Col>
            <Controller
              name="taxpayerAddress.province"
              control={control}
              render={({ field }) => (
                <FormControl
                  fullWidth
                  error={!!errors.taxpayerAddress?.province}
                >
                  <InputLabel>Province</InputLabel>
                  <Select {...field} label="Province">
                    {["Negros Oriental", "Negros Occidental"].map((p) => (
                      <MenuItem key={p} value={p}>
                        {p}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          </Col>
        </Row>

        <Row className="g-3 mb-4">
          <Col>
            <Controller
              name="taxpayerAddress.municipality"
              control={control}
              render={({ field }) => (
                <FormControl
                  fullWidth
                  error={!!errors.taxpayerAddress?.municipality}
                >
                  <InputLabel>Municipality</InputLabel>
                  <Select {...field} label="Municipality">
                    {Object.keys(zipCodes).map((m) => (
                      <MenuItem key={m} value={m}>
                        {m}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          </Col>
          <Col>
            <Controller
              name="taxpayerAddress.barangay"
              control={control}
              render={({ field }) => (
                <FormControl
                  fullWidth
                  error={!!errors.taxpayerAddress?.barangay}
                >
                  <InputLabel>Barangay</InputLabel>
                  <Select {...field} label="Barangay">
                    {(
                      barangays[watch("taxpayerAddress.municipality")] || []
                    ).map((b) => (
                      <MenuItem key={b} value={b}>
                        {b}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            />
          </Col>
        </Row>

        <Row className="g-3 mb-4">
          <Col>
            <Controller
              name="taxpayerAddress.addressDetails"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Unit/Room/Building/Street"
                  fullWidth
                  variant="outlined"
                  InputLabelProps={{ shrink: true }} // 👈 FIXED
                />
              )}
            />
          </Col>
          <Col>
            <Controller
              name="taxpayerAddress.zipCode"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="ZIP Code"
                  fullWidth
                  disabled
                  InputLabelProps={{ shrink: true }} // 👈 FIXED
                />
              )}
            />
          </Col>
        </Row>

        {/* ---------- Buttons ---------- */}
        <Box display="flex" justifyContent="space-between" mt={4}>
          <Button
            variant="outlined"
            onClick={handleSubmit((formValues) => {
              updateData(formValues); // save current state
              if (handleBack) handleBack();
            })}
            sx={{ width: "48%", fontWeight: "bold" }}
          >
            Previous
          </Button>
          <Button
            type="submit"
            variant="contained"
            sx={{ width: "48%", fontWeight: "bold" }}
          >
            Next
          </Button>
        </Box>
      </form>
    </Box>
  );
}

export default BusinessOperation;
