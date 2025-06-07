import { forwardRef } from 'react';
import { REGIONS_AND_CITIES, REGIONS } from '@/constants/locations';
import { getSelectClasses } from '@/utils/form';

interface RegionCitySelectorProps {
  regionValue: string;
  cityValue: string;
  onRegionChange: (value: string) => void;
  onCityChange: (value: string) => void;
  regionError?: string;
  cityError?: string;
  disabled?: boolean;
}

const RegionCitySelector = forwardRef<HTMLSelectElement, RegionCitySelectorProps>(
  ({ 
    regionValue, 
    cityValue, 
    onRegionChange, 
    onCityChange, 
    regionError, 
    cityError, 
    disabled 
  }, ref) => {
    return (
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label 
            htmlFor="region" 
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            Región
          </label>
          <select
            id="region"
            value={regionValue}
            onChange={(e) => {
              onRegionChange(e.target.value);
              onCityChange(''); // Reset city when region changes
            }}
            className={getSelectClasses(!!regionError)}
            disabled={disabled}
            aria-describedby={regionError ? 'region-error' : undefined}
          >
            <option value="">Selecciona una región</option>
            {REGIONS.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
          {regionError && (
            <p id="region-error" className="mt-1 text-sm text-red-500" role="alert">
              {regionError}
            </p>
          )}
        </div>

        <div>
          <label 
            htmlFor="city" 
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            Comuna
          </label>
          <select
            ref={ref}
            id="city"
            value={cityValue}
            onChange={(e) => onCityChange(e.target.value)}
            disabled={!regionValue || disabled}
            className={getSelectClasses(!!cityError, !regionValue)}
            aria-describedby={cityError ? 'city-error' : undefined}
          >
            <option value="">
              {regionValue ? 'Selecciona una comuna' : 'Primero selecciona una región'}
            </option>
            {regionValue && REGIONS_AND_CITIES[regionValue as keyof typeof REGIONS_AND_CITIES]?.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          {cityError && (
            <p id="city-error" className="mt-1 text-sm text-red-500" role="alert">
              {cityError}
            </p>
          )}
        </div>
      </div>
    );
  }
);

RegionCitySelector.displayName = 'RegionCitySelector';

export default RegionCitySelector; 