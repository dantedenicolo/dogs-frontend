export default function useValidate (input) {
  let errors = {}
  if (!input.name.trim()) {
    errors.name = 'Name is required'
  } else if (!/^[a-zA-Z\s]*$/.test(input.name)) {
    errors.name = 'Name is invalid'
  } else if (input.name.length < 3 || input.name.length > 50) {
    errors.name = 'Name must be between 3 and 50 characters'
  }
  if (!input.heightMin.trim()) {
    errors.heightMin = 'Height is required'
  } else if (!/^[0-9]*$/.test(input.heightMin)) {
    errors.heightMin = 'Height is invalid'
  } else if (Number(input.heightMin) < 1 || Number(input.heightMin) > 129) {
    errors.heightMin = 'Height must be between 1 and 129'
  }
  if (!input.heightMax.trim()) {
    errors.heightMax = 'Height is required'
  } else if (!/^[0-9]*$/.test(input.heightMax)) {
    errors.heightMax = 'Height is invalid'
  } else if (Number(input.heightMax) < 1 || Number(input.heightMax) > 129) {
    errors.heightMax = 'Height must be between 1 and 129'
  } else if (Number(input.heightMin) > Number(input.heightMax)) {
    errors.heightMax = 'Max height must be greater than min height'
  }
  if (!input.weightMin.trim()) {
    errors.weightMin = 'Weight is required'
  } else if (!/^[0-9]*$/.test(input.weightMin)) {
    errors.weightMin = 'Weight is invalid'
  } else if (Number(input.weightMin) < 1 || Number(input.weightMin) > 199) {
    errors.weightMin = 'Weight must be between 1 and 199'
  }
  if (!input.weightMax.trim()) {
    errors.weightMax = 'Weight is required'
  } else if (!/^[0-9]*$/.test(input.weightMax)) {
    errors.weightMax = 'Weight is invalid'
  } else if (Number(input.weightMax) < 1 || Number(input.weightMax) > 199) {
    errors.weightMax = 'Weight must be between 1 and 199'
  } else if (Number(input.weightMin) > Number(input.weightMax)) {
    errors.weightMax = 'Max weight must be greater than min weight'
  }
  if (!input.life_span.trim()) {
    errors.life_span = 'Life span is required'
  } else if (!/^[0-9]*$/.test(input.life_span)) {
    errors.life_span = 'Life span is invalid'
  } else if (Number(input.life_span) < 1 || Number(input.life_span) > 35) {
    errors.life_span = 'Life span must be between 1 and 35'
  } else if (input.temperament.length === 0) {
    errors.temperament = 'Al least one temperament is required'
  }
  return errors
}
