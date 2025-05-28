import React, { useState, useEffect } from 'react';
import {
  Box,
  Chip,
  Typography,
  Paper,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput
} from '@mui/material';

/**
 * ConditionFilterBar Component
 * 
 * Provides dropdown filters for specific clinical focus areas.
 * Allows MDs to filter patients by condition (Diabetes, RA, MS, Crohn's, etc.)
 */
const ConditionFilterBar = ({ onFilterChange }) => {
  const [selectedConditions, setSelectedConditions] = useState([]);
  const [availableConditions, setAvailableConditions] = useState([
    { id: 'diabetes', name: 'Diabetes' },
    { id: 'ra', name: 'Rheumatoid Arthritis' },
    { id: 'ms', name: 'Multiple Sclerosis' },
    { id: 'crohns', name: 'Crohn\'s Disease' },
    { id: 'copd', name: 'COPD' },
    { id: 'chf', name: 'Congestive Heart Failure' },
    { id: 'hypertension', name: 'Hypertension' },
    { id: 'ckd', name: 'Chronic Kidney Disease' }
  ]);

  useEffect(() => {
    // Notify parent component when filters change
    onFilterChange(selectedConditions);
  }, [selectedConditions, onFilterChange]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    // On autofill we get a stringified value.
    const selectedValues = typeof value === 'string' ? value.split(',') : value;
    setSelectedConditions(selectedValues);
  };

  const handleDelete = (conditionToDelete) => {
    setSelectedConditions(selectedConditions.filter(condition => condition !== conditionToDelete));
  };

  return (
    <Paper elevation={1} sx={{ p: 2, mb: 3 }}>
      <Box display="flex" alignItems="center" flexWrap="wrap">
        <Typography variant="subtitle2" sx={{ mr: 2, minWidth: '120px' }}>
          Filter by Condition:
        </Typography>
        
        <FormControl sx={{ minWidth: 200, flex: 1 }}>
          <InputLabel id="condition-filter-label">Select Conditions</InputLabel>
          <Select
            labelId="condition-filter-label"
            id="condition-filter"
            multiple
            value={selectedConditions}
            onChange={handleChange}
            input={<OutlinedInput label="Select Conditions" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => {
                  const condition = availableConditions.find(c => c.id === value);
                  return (
                    <Chip 
                      key={value} 
                      label={condition ? condition.name : value} 
                      onDelete={() => handleDelete(value)}
                      onMouseDown={(event) => {
                        event.stopPropagation();
                      }}
                    />
                  );
                })}
              </Box>
            )}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 48 * 4.5 + 8,
                  width: 250,
                },
              },
            }}
          >
            {availableConditions.map((condition) => (
              <MenuItem
                key={condition.id}
                value={condition.id}
              >
                {condition.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      <Box display="flex" alignItems="center" flexWrap="wrap">
        <Typography variant="subtitle2" sx={{ mr: 2 }}>
          Active Filters:
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {selectedConditions.length === 0 ? (
            <Typography variant="body2" color="text.secondary">
              No filters applied - showing all conditions
            </Typography>
          ) : (
            selectedConditions.map((value) => {
              const condition = availableConditions.find(c => c.id === value);
              return (
                <Chip
                  key={value}
                  label={condition ? condition.name : value}
                  onDelete={() => handleDelete(value)}
                  color="primary"
                  variant="outlined"
                  size="small"
                />
              );
            })
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default ConditionFilterBar;
