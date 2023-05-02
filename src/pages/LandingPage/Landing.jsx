/**
 * @file Landing.jsx
 * @name Landing.jsx
 * @author @moSaeed15
 * @requires react
 * @requires react-router-dom
 * @requires ./styles/Landing.styled
 * @requires ./EventBox
 * @exports Landing
 * @description This file contains the Landing page components and its logic
 */
import DateRangePicker from 'tw-daterange';

import { useRef } from 'react';

import { useEffect, useState } from 'react';
import { StyledLandingEvents } from './styles/Landing.styled';
import { StyledEventsContainer } from './styles/Landing.styled';
import { StyledNav } from './styles/Landing.styled';
import {
  Link,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';

import logo from '../../assets/icon-down.png';
import cross from '../../assets/x-10327.png';
import error from '../../assets/noevent-error.png';
import EventBox from './EventBox';
import NavbarLoggedIn from './NavbarLoggedIn';
import Navbar from './NavBar';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';
/**
 * A functional component that handles the landing page and event filtering.
 *
 * @returns {JSX.Element} The JSX representation of the component.
 */

export default function Landing() {
  /**
   * google maps Autocomplete
   *
   */

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyC-V5bPta57l-zo8nzZ9MIxxGqvONc74XI',
    libraries: ['places'],
  });

  const [cityData, setCity] = useState({});
  const ref = useRef(null);
  const reference = useRef(null);
  const refDrop = useRef(null);
  const refCal = useRef(null);

  const [forYouElement, setForYouElement] = useState(false);
  const [showCalender, setShowCalender] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);

  const [count, setCount] = useState(0);
  const [showDateRange, setShowDate] = useState(false);

  const [range, setRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });

  const [select, setSelect] = useState('');
  const [selectCategory, setSelectCategory] = useState('');
  const [url, setUrl] = useState('');

  useEffect(() => {
    // add event listener to the document
    document.addEventListener('mousedown', handleClickMenuOutside);
    return () => {
      // remove event listener when component unmounts
      document.removeEventListener('mousedown', handleClickMenuOutside);
    };
  }, []);

  const handleClickMenuOutside = event => {
    if (refDrop.current && !refDrop.current.contains(event.target)) {
      // if clicked outside of the ref div, hide the element
      setShowMenu(false);
      //if (range.startDate && range.endDate && count === 1)
      //setShowCalender(false);
    }
  };

  useEffect(() => {
    // add event listener to the document
    document.addEventListener('mousedown', handleClickCalenderOutside);
    return () => {
      // remove event listener when component unmounts
      document.removeEventListener('mousedown', handleClickCalenderOutside);
    };
  }, []);

  const handleClickCalenderOutside = event => {
    if (refCal.current && !refCal.current.contains(event.target)) {
      setShowMenu(false);
      setShowCalender(false);
    }
  };

  useEffect(() => {
    // add event listener to the document
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // remove event listener when component unmounts
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleClickOutside = event => {
    if (reference.current && !reference.current.contains(event.target)) {
      // if clicked outside of the ref div, hide the element
      setShowCategoryMenu(false);
    }
  };

  /**
   * Updates the textContent of div and handles calender.
   *
   * @param {Object} e - The event object.
   */

  function onClickCalender(e) {
    const { name, value } = e.target;
    if (name === 'calender') {
      setShowCalender(true);
      //setShowMenu(false);
    } else {
      setShowMenu(false);
      setSelect(name);
      if (name === 'Today') {
        setUrl(
          'startDate=' + range.startDate.toISOString() + '&futureDate=today'
        );
      }
      if (name === 'This weekend') {
        setUrl(
          'startDate=' + range.startDate.toISOString() + '&futureDate=weekend'
        );
      }
      if (name === 'Tomorrow') {
        setUrl(
          'startDate=' + range.startDate.toISOString() + '&futureDate=tomorrow'
        );
      }
    }
  }
  function onClickCategory(e) {
    const { name, value } = e.target;
    setShowCategoryMenu(false);
    setSelectCategory(name);
    let new_name = name.replace(/&/g, '%26');
    let queryName = 'category=' + new_name;
    setUrl(queryName);
    //handleClick()
  }
  function showDropdown() {
    if (!select) {
      setShowMenu(true);
    }
  }
  function showDropdownCategory() {
    if (!selectCategory) {
      setShowCategoryMenu(true);
    }
  }
  const [focused, setFocused] = useState({
    All: true,
    forYou: false,
    online: false,
    today: false,
    weekend: false,
    women: false,
    free: false,
    music: false,
    food: false,
    charity: false,
  });

  /**
   * A custom React hook that fetches the city name from the latitude and longitude.
   *
   * @param {number} latitude - The latitude of the location.
   * @param {number} longitude - The longitude of the location.
   * @returns {string} The name of the city.
   */

  useEffect(() => {
    const fetchData = async (latitude, longitude) => {
      const data = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=AIzaSyC-V5bPta57l-zo8nzZ9MIxxGqvONc74XI`
      );

      const json = await data.json();
      let country, city;

      json.results[0].address_components.forEach(component => {
        if (component.types.includes('locality')) {
          city = component.long_name;
        }
        if (component.types.includes('country')) {
          country = component.long_name;
        }
      });
      const cityName =
        json.results[0].address_components[4].long_name.split(' ')[0];
      setCity({
        city: cityName,
        country: country,
      });
      setUrl(`city=${cityName}&country=${country}`);
    };
    navigator.geolocation?.getCurrentPosition(poistion => {
      const { latitude, longitude } = poistion.coords;

      fetchData(latitude, longitude);
    });
  }, []);
  console.log(url);
  function handleForYou() {
    setForYouElement(true);
    //setShowCategoryMenu(false);
    setFocused(prevFocus => {
      return {
        forYou: true,
      };
    });
  }

  function onClickAll(e) {
    removeDate();
    removeCategory();
    handleClick();
    setForYouElement(false);
    const { name, value } = e.target;
    setFocused(prevFocus => {
      return {
        [name]: true,
      };
    });
    setShowMenu(false);
    if (!focused.All) {
      //setShowCategoryMenu(false);
    }
    if (name === 'All') {
      setUrl('');
    }
    if (name === 'online') {
      setUrl('eventHosted=online');
    }
    if (name === 'today') {
      setUrl(
        'startDate=' + range.startDate.toISOString() + '&futureDate=today'
      );
    }
    if (name === 'weekend') {
      setUrl(
        'startDate=' + range.startDate.toISOString() + '&futureDate=weekend'
      );
    }
    if (name === 'music') {
      setUrl('category=Music');
    }
    if (name === 'food') {
      setUrl('category=Food %26 Drink');
    }
    if (name === 'charity') {
      setUrl('category=Charity %26 Causes');
    }
    if (name === 'free') {
      setUrl('freeEvent=Free');
    }
  }

  function removeDate() {
    setShowDate(false);
    setSelect('');
  }

  function removeCategory() {
    setSelectCategory('');
    setUrl('');
  }

  useEffect(() => {
    if (range.startDate && range.endDate && count === 1) {
      setShowCalender(false);
      setShowMenu(false);
      setShowDate(true);
      setUrl(
        'startDate=' +
          range.startDate.toISOString() +
          '&endDate=' +
          range.endDate.toISOString()
      );
    } else {
      setCount(1);
    }
  }, [range.startDate]);

  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];
  const [allFilteredEvents, setAllFilteredEvents] = useState([]);
  const [allCatEvents, setAllCatEvents] = useState([]);
  const [noEvents, setNoEventsImg] = useState(false);

  /**
   * @function useEffect
   * @name useEffect
   * @description This function is a hook that fetches the filtered data from backend
   * @param {function} getData
   * @returns {Object} An object representing the event data
   */

  useEffect(() => {
    console.log(cityData);
    async function getData() {
      const res = await fetch(
        'https://www.tessera.social/api/attendee/Eventsby/?' + url
      );
      const data = await res.json();
      setAllFilteredEvents(data.filteredEvents);
      setAllCatEvents(data.categoriesRetreived);
    }
    getData();
  }, [url]);

  /**
   * Changes the Isodate to display date format.
   *
   * @param {String} dataString - The event date in Iso format.
   * @returns {String}
   */

  const convertUtcToLocalTime = dateString => {
    let date = new Date(dateString);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    const milliseconds = Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds()
    );
    const localTime = new Date(milliseconds);
    return `${dayName}, ${
      monthNames[localTime.getMonth()]
    } ${localTime.getDate()}, ${localTime.getHours()}:${
      localTime.getMinutes() === 0 ? '00' : localTime.getMinutes()
    }`;
  };

  const minPrice = (p, q) => {
    if (p > q) {
      return q;
    } else {
      return p;
    }
  };

  const [eventElements, setEventElement] = useState();
  const [catElements, setCatElement] = useState();
  /**
   * @function useEffect
   * @name useEffect
   * @description This function is a hook that updates the events displayed according to query
   * @param {function} setEventElement
   * @returns {JSX.Element} An object representing the eventbox
   */
  useEffect(() => {
    if (allFilteredEvents.length === 0) {
      setNoEventsImg(true);
    } else {
      setNoEventsImg(false);
    }

    const handleEventPage = id => {
      console.log('first');
    };

    setEventElement(
      allFilteredEvents.map(event => (
        <EventBox
          id={event._id}
          key={event._id}
          image={
            event.basicInfo.eventImage !== 'https://example.com/image.jpg'
              ? event.basicInfo.eventImage
              : '/images/event__5.avif'
          }
          eventTitle={event.basicInfo.eventName}
          date={convertUtcToLocalTime(event.basicInfo.startDateTime)}
          description={
            event.basicInfo.location.venueName +
            ' • ' +
            event.basicInfo.location.city +
            ' '
          }
          price={
            event.ticketTiers[0].price !== 'Free'
              ? `Starts at ${minPrice(
                  event.ticketTiers[0].price,
                  event.ticketTiers[1].price
                )}`
              : ''
          }
          isFree={event.ticketTiers[0].price === 'Free'}
          organizer={
            event.creatorId
              ? event.creatorId.firstName + ' ' + event.creatorId.lastName
              : ''
          }
          followers={event.ticketTiers.length}
        />
      ))
    );
  }, [allFilteredEvents]);

  /**
   * @function useEffect
   * @name useEffect
   * @description This function is a hook that updates the categories displayed in deropdown list
   * @param {function} setEventElement
   * @returns {JSX.Element} An object representing the dropdown elements
   */

  useEffect(() => {
    setCatElement(
      allCatEvents.map(cat => (
        <div>
          <button name={cat} className="drop-button" onClick={onClickCategory}>
            {cat}
          </button>
        </div>
      ))
    );
  }, [allCatEvents]);

  const handleClick = () => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };
  const email = localStorage.getItem('email')
    ? localStorage.getItem('email')
    : localStorage.getItem('authEmail');
  const [selected, setSelected] = useState(null);

  const [showLocationMenu, setShowLocationMenu] = useState(false);
  const locationDropDownToggle = e => {
    const h3 = e.target.closest('h3');

    !h3 && setShowLocationMenu(false);
  };
  return (
    <>
      <StyledNav>
        {email && email !== 'undefined' ? (
          <NavbarLoggedIn show={true} email={email} />
        ) : (
          <Navbar onClick={locationDropDownToggle} show={true} />
        )}
      </StyledNav>
      <StyledLandingEvents onClick={locationDropDownToggle}>
        {isLoaded && (
          <PlacesAutocomplete
            setCity={setCity}
            cityData={cityData}
            setSelected={setSelected}
            showLocationMenu={showLocationMenu}
            setShowLocationMenu={setShowLocationMenu}
            setURL={setUrl}
          />
        )}

        <div className="filter__nav">
          <nav className="">
            <ul>
              <li className="first-Filter">
                <button
                  className="nav--filter"
                  name="All"
                  onClick={onClickAll}
                  style={
                    focused.All
                      ? {
                          color: 'blue',
                          paddingBottom: '3px',
                          borderBottom: '2px solid blue',
                        }
                      : { background: 'none' }
                  }
                >
                  All
                </button>
              </li>

              <li>
                <button
                  onClick={handleForYou}
                  className="nav--filter"
                  style={
                    focused.forYou
                      ? {
                          color: 'blue',
                          paddingBottom: '3px',
                          borderBottom: '2px solid blue',
                        }
                      : { background: 'none' }
                  }
                >
                  <span>For you</span>
                </button>
              </li>

              <li>
                <button
                  className="nav--filter"
                  name="online"
                  onClick={onClickAll}
                  style={
                    focused.online
                      ? {
                          color: 'blue',
                          paddingBottom: '3px',
                          borderBottom: '2px solid blue',
                        }
                      : { background: 'none' }
                  }
                >
                  Online
                </button>
              </li>

              <li>
                <button
                  className="nav--filter"
                  name="today"
                  onClick={onClickAll}
                  style={
                    focused.today
                      ? {
                          color: 'blue',
                          paddingBottom: '3px',
                          borderBottom: '2px solid blue',
                        }
                      : { background: 'none' }
                  }
                >
                  Today
                </button>
              </li>

              <li>
                <button
                  className="nav--filter"
                  name="weekend"
                  onClick={onClickAll}
                  style={
                    focused.weekend
                      ? {
                          color: 'blue',
                          paddingBottom: '3px',
                          borderBottom: '2px solid blue',
                        }
                      : { background: 'none' }
                  }
                >
                  This Weekend
                </button>
              </li>

              <li>
                <button
                  onClick={onClickAll}
                  name="free"
                  className="nav--filter"
                  style={
                    focused.free
                      ? {
                          color: 'blue',
                          paddingBottom: '3px',
                          borderBottom: '2px solid blue',
                        }
                      : { background: 'none' }
                  }
                >
                  Free
                </button>
              </li>

              <li>
                <button
                  onClick={onClickAll}
                  name="music"
                  className="nav--filter"
                  style={
                    focused.music
                      ? {
                          color: 'blue',
                          paddingBottom: '3px',
                          borderBottom: '2px solid blue',
                        }
                      : { background: 'none' }
                  }
                >
                  Music
                </button>
              </li>

              <li>
                <button
                  className="nav--filter"
                  onClick={onClickAll}
                  name="food"
                  style={
                    focused.food
                      ? {
                          color: 'blue',
                          paddingBottom: '3px',
                          borderBottom: '2px solid blue',
                        }
                      : { background: 'none' }
                  }
                >
                  Food & Drink
                </button>
              </li>

              <li>
                <button
                  className="nav--filter"
                  onClick={onClickAll}
                  name="charity"
                  style={
                    focused.charity
                      ? {
                          color: 'blue',
                          paddingBottom: '3px',
                          borderBottom: '2px solid blue',
                        }
                      : { background: 'none' }
                  }
                >
                  Charity & causes
                </button>
              </li>
            </ul>
          </nav>

          {focused.All && (
            <div className="date-dropdown">
              <div className="you--options" onClick={showDropdownCategory}>
                {selectCategory ? (
                  <span>
                    {selectCategory}
                    <button onClick={removeCategory} className="remove-button">
                      <img src={cross} />
                    </button>
                  </span>
                ) : (
                  <span>
                    Category
                    <img src={logo} />
                  </span>
                )}
              </div>
              {showCategoryMenu && (
                <div
                  id="myDropdown"
                  ref={reference}
                  className="dropdown-content"
                >
                  <ul>{catElements}</ul>
                </div>
              )}
            </div>
          )}

          {forYouElement && (
            <div className="date-dropdown">
              <div
                className="you--options"
                data-testid="forYou"
                onClick={showDropdown}
              >
                {showDateRange ? (
                  <span>
                    {monthNames[range.startDate.getMonth()] +
                      ' ' +
                      range.startDate.getDate() +
                      ' - ' +
                      monthNames[range.endDate.getMonth()] +
                      ' ' +
                      range.endDate.getDate()}
                    <button onClick={removeDate} className="remove-button">
                      <img src={cross} />
                    </button>
                  </span>
                ) : select ? (
                  <span>
                    {select}
                    <button onClick={removeDate} className="remove-button">
                      <img src={cross} />
                    </button>
                  </span>
                ) : (
                  <span>
                    Date
                    <img src={logo} />
                  </span>
                )}
              </div>
              {showMenu && (
                <div id="myDropdown" className="dropdown-content" ref={refDrop}>
                  <ul>
                    <div>
                      <button
                        name="calender"
                        className="drop-button"
                        onClick={onClickCalender}
                      >
                        Calender
                      </button>
                    </div>
                    <div>
                      <button
                        name="Today"
                        className="drop-button"
                        onClick={onClickCalender}
                      >
                        Today
                      </button>
                    </div>
                    <div>
                      <button
                        onClick={onClickCalender}
                        name="Tomorrow"
                        className="drop-button"
                      >
                        Tomorrow
                      </button>
                    </div>
                    <div>
                      <button
                        name="This weekend"
                        onClick={onClickCalender}
                        className="drop-button"
                      >
                        This weekend
                      </button>
                    </div>
                  </ul>
                </div>
              )}

              {showCalender && (
                <div>
                  <div className="dropdown-content" ref={refCal}>
                    <DateRangePicker
                      wrapperClassName="datePicker"
                      initialRange={range}
                      onUpdate={dateRange => {
                        setRange(dateRange);
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          <h4>Events in {cityData.city}</h4>
          <StyledEventsContainer
            ref={ref}
            img="../../src/assets/svgviewer-output.svg"
          >
            {eventElements}
            {noEvents && (
              <div className="error-img">
                <img src={error} />
              </div>
            )}
          </StyledEventsContainer>
        </div>
      </StyledLandingEvents>
    </>
  );
}
const PlacesAutocomplete = ({
  setSelected,
  cityData,
  setCity,
  showLocationMenu,
  setShowLocationMenu,
  setURL,
}) => {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();
  const [hideDefault, setHideDefault] = useState(false);
  const handleSelect = async e => {
    const address = e.target.innerText;
    setValue(address, false);
    clearSuggestions();

    const results = await getGeocode({ address });
    const { lat, lng } = getLatLng(results[0]);
    console.log(results, lat, lng);

    const data = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyC-V5bPta57l-zo8nzZ9MIxxGqvONc74XI`
    );

    const json = await data.json();
    const cities = json.results;

    let country, city;

    for (let i = 0; i < cities.length; i++) {
      const addressComponents = cities[i].address_components;
      for (let j = 0; j < addressComponents.length; j++) {
        const types = addressComponents[j].types;
        if (types.indexOf('locality') !== -1) {
          city = addressComponents[j].long_name;
        }
        if (types.indexOf('country') !== -1) {
          country = addressComponents[j].long_name;
        }
      }
    }

    setCity({
      city: city,
      country: country,
    });
    console.log(city, country);
    setURL(`city=${city}&country=${country}`);
  };

  function handleClick() {
    setShowLocationMenu(true);
  }

  return (
    <>
      <h3>
        Popular in
        <svg
          id="chevron-down-chunky_svg__eds-icon--chevron-down-chunky_svg"
          x="0"
          y="0"
          viewBox="0 0 24 24"
          xmlSpace="preserve"
        >
          <path
            id="chevron-down-chunky_svg__eds-icon--chevron-down-chunky_base"
            fill="evenodd"
            clip="evenodd"
            d="M7 10.2l5 5 5-5-1.4-1.4-3.6 3.6-3.6-3.6z"
          ></path>
        </svg>
        <input
          onClick={handleClick}
          type="text"
          value={value}
          placeholder={cityData.city}
          onChange={e => {
            setHideDefault(true);
            setValue(e.target.value);
          }}
          disabled={!ready}
        />
        {showLocationMenu && (
          <ul className="location__dropdown">
            {!hideDefault && (
              <div className="">
                <li className="current__location">
                  <svg viewBox="0 0 24 24">
                    <g
                      id="crosshair_svg__Crosshair"
                      stroke="none"
                      strokeWidth="1"
                      fill="blue"
                      fillRule="evenodd"
                    >
                      <path
                        d="M11 18.93A7.005 7.005 0 015.07 13H3v-2h2.07A7.005 7.005 0 0111 5.07V3h2v2.07A7.005 7.005 0 0118.93 11H21v2h-2.07A7.005 7.005 0 0113 18.93V21h-2v-2.07zM12 17a5 5 0 100-10 5 5 0 000 10zm0-3a2 2 0 110-4 2 2 0 010 4z"
                        id="crosshair_svg__crosshair"
                        fill="#blue"
                      ></path>
                    </g>
                  </svg>
                  Use My Current Location
                </li>
                <li className="online__location">
                  <svg
                    id="video-chunky_svg__eds-icon--video-chunky_svg"
                    x="0"
                    y="0"
                    viewBox="0 0 24 24"
                    xmlSpace="preserve"
                  >
                    <g id="video-chunky_svg__eds-icon--video-chunky_base">
                      <path
                        d="M19 4v1H5V4H3v16h2v-1h14v1h2V4h-2zm0 13H5V7h14v10z"
                        fill="blue"
                      ></path>
                    </g>
                    <path
                      id="video-chunky_svg__eds-icon--video-chunky_play"
                      d="M10 15l5-3-5-3z"
                      fill="blue"
                    ></path>
                  </svg>
                  Browse Online Events
                </li>
              </div>
            )}

            {status === 'OK' &&
              data.map(data => {
                {
                  /* console.log(data); */
                }
                return (
                  <li onClick={handleSelect} key={data.place_id}>
                    {data.description}
                  </li>
                );
              })}
          </ul>
        )}
      </h3>
    </>
  );
};
