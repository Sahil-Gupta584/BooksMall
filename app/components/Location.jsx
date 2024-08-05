'use client';
import { useEffect, useState } from 'react'
import axios from 'axios';
import Select from 'react-select';


async function getLocationDetails() {

  function getUserLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
      } else {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      }
    });
  }

  function reverseGeocode(latitude, longitude) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;

    return fetch(url)
      .then(response => response.json())
      .then(data => {
        const address = data.address;

        return {
          city: address.city || address.town || address.village || address.hamlet,
          state: address.state
        };
      });
  }

  try {
    const position = await getUserLocation();
    // console.log(position)
    const { latitude, longitude } = position.coords;
    const locationInfo = await reverseGeocode(latitude, longitude);
    console.log('City:', locationInfo.city);
    console.log('State:', locationInfo.state);
    return locationInfo;
  } catch (error) {
    console.error('Error getting location:', error);
  }
}

const CustomLocation = ({location}) => {
  const [selectedState, setSelectedState] = useState(() => {
  return location && location.state
    ? { value: location.state, label: location.state }
    : null;
});

const [selectedCity, setSelectedCity] = useState(() => {
  return location && location.city
    ? { value: location.city, label: location.city }
    : null;
});
  const [allStates, setAllStates] = useState([]);
  const [allCities, setAllCities] = useState([]);

  useEffect(() => {
    console.log('ddefaultLocation:',location)
    axios
      .get('https://raw.githubusercontent.com/mbaye19/country-data/main/States.json')
      .then(response => {
        const states = response.data
          .filter(state => state.country_code === 'IN')
          .map(state => ({ value: state.name, label: state.name }));
        setAllStates(states);
        console.log(states)
      })
      .catch(err => {
        console.log('Error fetching states data:', err);
      });

      if(selectedState && selectedState.value.length>0){

        axios.get('https://raw.githubusercontent.com/mbaye19/country-data/main/Cities.json').then(res=>{
          const cities = res.data.filter(city => city.state_name === selectedState.label).map(city => ({ label: city.name, value: city.name }));
          console.log('cities:',cities)
          setAllCities(cities)
        });
      }
  }, []);

  const handleStateSelect = async (selectedOption) => {
    setSelectedState(selectedOption);
    setSelectedCity(null);
    console.log(selectedOption)
    const cities = (await axios.get('https://raw.githubusercontent.com/mbaye19/country-data/main/Cities.json')).data.filter(city => city.state_name === selectedOption.label).map(city => ({ label: city.name, value: city.name }));
    setAllCities(cities)
    console.log(cities);
    // handleChange(selectedOption)
    // Here you would typically fetch cities for the selected state
    // and update allCities state
  };

  const handleCitySelect = (selectedOption) => {
    setSelectedCity(selectedOption);
  };

  return (
    <div className='flex flex-col justify-center border-[gray] m-4'>
      <Select
        className="mb-4"
        classNamePrefix='select'
        defaultValue={selectedState}
        isClearable
        isSearchable
        name='state'
        options={allStates}
        value={selectedState}
        onChange={handleStateSelect}
        placeholder='Select state'
        id='state'
        required
      />
      <Select
       id='city'
        className="mb-4"
        classNamePrefix='select'
        defaultValue={selectedCity}
        isClearable
        isSearchable
        name='city'
        options={allCities}
        value={selectedCity}
        onChange={handleCitySelect}
        placeholder='Select city'
        isDisabled={!selectedState}
        required
      />
    </div>
  );
};

function CurrentLocation({ handleChange }) {
  const [gotLocation, setGotLocation] = useState(false);
  const [location, setLocation] = useState(null)

  useEffect(() => {

    getLocationDetails().then(res => {
      setLocation(res)
      setGotLocation(true)
      return res;
    }).catch(err => setGotLocation(false));
    // location.city ? gotLocation(true) : setGotLocation(false)
  }, [])

  if (!gotLocation) {

    return (<div className='loading loading-spinner'></div>)

  }
  if (gotLocation) {
    return (
      <div className="">
        <ul className='flex justify-between border-b-[grey] border-b p-1'>
          <li className='text-[rgba(0,47,52,0.64)]' >State</li>
          <li>{location.state}</li>
        </ul>
        <ul className='flex justify-between border-b-[grey] border-b p-1'>
          <li className='text-[rgba(0,47,52,0.64)]' >City</li>
          <li>{location.city}</li>
        </ul>
      </div>

    )
  }
}
export { CustomLocation, CurrentLocation };
