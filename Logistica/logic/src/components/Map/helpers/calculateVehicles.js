// calculateVehicles.js
export const calculateRequiredVehicles = (vehicleCapacity, cargoWeight) => {
    if (!vehicleCapacity || !cargoWeight) {
      return { requiredVehicles: 0, error: 'Missing vehicle or cargo data' };
    }
  
    const requiredVehicles = Math.ceil(cargoWeight / vehicleCapacity);
    return { requiredVehicles };
  };
  