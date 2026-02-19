import CloseIcon from '@mui/icons-material/Close';
import { Button, Tooltip } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import PropTypes from 'prop-types';
import GeneralFundAllTable from '../../../FRONTEND/components/ABSTRACT/GF/TableData/GeneralFundAllTable';

function GeneralFundDialog({ open, onClose, data }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth={false} fullWidth PaperProps={{
      sx: { width: '90vw', maxWidth: 'none' }
    }}>
     <DialogTitle>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          General Fund View
          <Button onClick={onClose} color="secondary">
            <Tooltip title="Close">
              <CloseIcon fontSize="large"/>
            </Tooltip>
          </Button>
          
        </div>
      </DialogTitle>
      <DialogContent sx={{ overflowX: 'auto' }}>
        <GeneralFundAllTable data={[data]} />
      </DialogContent>
    </Dialog>
  );
}

GeneralFundDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,  // Define the type based on your data structure
};

export default GeneralFundDialog;
