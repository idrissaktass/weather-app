<<<<<<< HEAD
import React, { useState, useEffect, useRef } from "react";
import { useMediaQuery } from 'react-responsive';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CSSTransition } from 'react-transition-group';
import Dropdown from 'react-bootstrap/Dropdown';
import { getAuth, deleteUser } from "firebase/auth";
import Avatar from 'boring-avatars';
import { URL } from '../../Helpers';
import { useNavigate, useLocation, Link as RouterLink } from "react-router-dom";
import { Typography, AppBar, Toolbar, Box, Button, Grid, SvgIcon } from "@mui/material";
import { useUser } from "../../contexts/UserContext";
import { ReactComponent as Home } from '../../data/home-icon.svg';
import { ReactComponent as MySessionWhite } from '../../data/mysession-white-icon.svg';
import { ReactComponent as MySessionBlue } from '../../data/mysession-blue-icon.svg';
import { ReactComponent as MyMood } from '../../data/mymood-icon.svg';
import { ReactComponent as Articles } from '../../data/blog-icon.svg';
import { ReactComponent as PokaTherapy } from '../../data/psychology.svg';
import { ReactComponent as IconBlue } from '../../data/iconblue.svg';
import { ReactComponent as HeartBlue } from '../../data/heart-blue.svg';
import { ReactComponent as HeartWhite } from '../../data/heart-white.svg';
import './Navbar.scss'
import UserDisplay from '../home/UserDisplay';

const Navbar = () => {
  const auth = getAuth();
  const navigate = useNavigate()
  const location = useLocation()
  const node = useRef();
  const { user, role, tier, premium_status, stripe_customer_id } = useUser();
  const [userName, setUserName] = useState('');

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [email, setEmail] = useState(null);

  const isMobile = useMediaQuery({ query: '(max-width: 900px)' });
  const isSmallerThan1100px = useMediaQuery({ query: '(max-width: 1100px)' });
  const isMedium = useMediaQuery({ query: '(max-width: 1500px)' });

  const isMymoodPage = location.pathname === "/mymood";
  const isSessionPage = location.pathname === "/session";
  const isHomePage = location.pathname === "/get-started"
  const isBlogPage = location.pathname === "/blogs";
  const isTherapyPage = location.pathname === "/book-therapist";
  const isTherapist = location.pathname === "/therapist-view";
  const isCornerPage = location.pathname === "/calm-corner";

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user || !user.uid) {
        console.log("User or UID not available");
        return; // Exit the function if user or UID is not available
      }

      try {
        const response = await fetch(`${URL}/getProfile/${user.uid}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.accessToken}`
          }
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setUserName(data.displayName); 
      } catch (err) {
        console.log("Error fetching name:", err);     
      }
    };

    fetchUserProfile();
  }, [user]);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleClickOutside = e => {
    if (node.current.contains(e.target)) {
      return;
    }
    setIsMenuOpen(false);
  };

  const handleDeleteAccount = async () => {
    const confirmation = window.confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (confirmation) {
      try {
        await deleteUser(auth.currentUser);
      } catch (error) {
        console.error('Error deleting account', error);
      }
    }
  };

  const userLink = role === 'user' && (
    isTherapyPage ? (
      <Button
        reloadDocument
        component={RouterLink}
        to="/book-therapist"
        variant="header"
      >
        <SvgIcon component={PokaTherapy} inheritViewBox />
        <Typography variant="body2Bold">MYTHERAPY</Typography>
      </Button>
    ) : (
      <Button
        component={RouterLink}
        to="/book-therapist"
        sx={{
          m: 0,
          gap: "8px",
          "&:hover": {
            background: "none",
          }
        }}
      >
        <Box
          sx={{
            bgcolor: "primary.backgroundBlue",
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <SvgIcon component={PokaTherapy} inheritViewBox fill="primary.main" />
        </Box>
        <Typography variant="body2Bold">MYTHERAPY</Typography>
      </Button>
    )
  );

  const therapistLink = role === 'therapist' && (
    isTherapist ? (
      <Button
        component={RouterLink}
        reloadDocument
        to="/therapist-view"
        variant="header"
      >
        <SvgIcon component={PokaTherapy} inheritViewBox />
        <Typography variant="body2Bold">MYTHERAPY</Typography>
      </Button>
    ) : (
      <Button
        component={RouterLink}
        to="/therapist-view"
        sx={{
          m: 0,
          gap: "8px",
          "&:hover": {
            background: "none",
          }
        }}
      >
        <Box
          sx={{
            bgcolor: "primary.backgroundBlue",
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <SvgIcon component={PokaTherapy} inheritViewBox fill="primary.main" />
        </Box>
        <Typography variant="body2Bold">MYTHERAPY</Typography>
      </Button>
    )
  );

  useEffect(() => {
    // const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      setEmail(user.email);
    } else {
      setEmail(null);
    }
    // });

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      // unsubscribe();
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  return (
    <>
      <AppBar position="static" sx={{ bgcolor: "#FFF7F1", my: 3, color: "primary.main" }} elevation={0} ref={node}>
        <Toolbar>
          {isMobile ? (
            <>
            <Box display={"flex"} height={"50px"} width={"350px"} overflow={"hidden"} alignItems={"center"} >
              <SvgIcon component={IconBlue} inheritViewBox style={{width:"50px", height:"auto"}}/>
              {/* <SvgIcon component={FullBlue} inheritViewBox style={{width:"125px", height:"120px"}}/> */}
               <Typography
                variant="sb24Bold"
                component={RouterLink}
                to="/get-started"
                sx={{ color: "rgb(92, 131, 191)", textDecoration: 'none', paddingBottom:"5px" }}
              >
                pokamind
              </Typography>
              {/*<Typography variant="body2SemiBold" sx={{ pb: 5, flexGrow: 1, color: "primary.darkerBlue" }}>BETA</Typography> */}
            </Box>
            <Grid container sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }} spacing={0}>
              <Typography
                variant="body2Bold"
                sx={{ pr: 2 }}
              >
<UserDisplay user={user} />
              </Typography>
              <FontAwesomeIcon
                icon="fa-solid fa-bars"
                size="xl"
                onClick={handleMenuToggle} />
              <CSSTransition
                in={isMenuOpen}
                timeout={300}
                classNames="mobile-menu-transition"
                unmountOnExit
              >
                <div className="mobile_menu">
                  <Grid sx={{ display: "flex", flexDirection: "column" }}>
                    <Box sx={{ pr: 3, pb: 3, display: "flex", justifyContent: "end" }}>
                      <FontAwesomeIcon
                        icon="fa-solid fa-xmark"
                        size="xl"
                        style={{ color: '#ffffff' }}
                        onClick={handleMenuToggle} />
                    </Box>

                    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                      <Typography
                        variant="body2Bold"
                        component="div"
                        sx={{ color: "secondary.main", display: "flex", alignItems: "center", pl: 2 }}
                      >
<UserDisplay user={user} />
                      </Typography>
                      <Dropdown>
                        <Dropdown.Toggle variant="text" id="dropdown-basic">
                          <Avatar name={email || 'default'} size={32} variant="beam" />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          {user ? (
                            <>
                            <Dropdown.Item onClick={() => navigate('/user-profile')}>MyProfile</Dropdown.Item>


                            <Dropdown.Item onClick={() => auth.signOut().then(() => {
                              localStorage.removeItem('user');
                              localStorage.removeItem('role');
                              sessionStorage.clear();
                              navigate('/');
                            }
                            )}>Sign Out</Dropdown.Item>
                            <Dropdown.Item onClick={handleDeleteAccount}>Delete Account</Dropdown.Item>
                            </>
                          ) : (
                            <Dropdown.Item onClick={() => navigate('/auth')}>Login</Dropdown.Item>
                          )}
                        </Dropdown.Menu>
                      </Dropdown>
                    </Box>
                    {// free tier with no premium_status (no subscription)
                      role !== "admin" && tier === "free" && !premium_status ?
                        (

                          <Button
                            component={RouterLink}
                            to="/plans"
                            sx={{
                              color: "secondary.main",
                              display: "block",
                              my: "5px"
                            }}
                          >
                            <Typography
                              variant="body2Bold"
                              component="div"
                              alignItems={"center"}
                              sx={{ display: "flex", justifyContent: "end", gap: "6px" }}
                            >

                              <div>TRY PREMIUM</div>
                            </Typography>
                          </Button>
                        ) :
                        // problem with premium_status like "overdue"
                        role !== "admin" && tier === "free" && premium_status ?
                          (
                            // <a href= className="no-style d-block hamburger-menu_links text-danger">
                            //   Fix subscription
                            // </a>
                            <Button
                              href={process.env.REACT_APP_StripeCustomerPortal + `?prefilled_email=${encodeURIComponent(user.email)}`}
                              sx={{
                                color: "secondary.main",
                                display: "block",
                                my: "5px"
                              }}
                            >
                              <Typography
                                variant="body2Bold"
                                component="div"
                                alignItems={"center"}
                                sx={{ display: "flex", justifyContent: "end", gap: "6px" }}
                              >

                                <div>FIX SUBSCRIPTION</div>
                              </Typography>
                            </Button>
                          ) : (
                            // active subscription
                            role !== "admin" && tier === "premium" &&
                            // <a href={process.env.REACT_APP_StripeCustomerPortal + `?prefilled_email=${user.email}`} className="no-style d-block hamburger-menu_links">
                            //   Manage subscription
                            // </a>
                            <Button
                              href={process.env.REACT_APP_StripeCustomerPortal + `?prefilled_email=${encodeURIComponent(user.email)}`}
                              sx={{
                                color: "secondary.main",
                                display: "block",
                                my: "5px"
                              }}
                            >
                              <Typography
                                variant="body2Bold"
                                component="div"
                                alignItems={"center"}
                                sx={{ display: "flex", justifyContent: "end", gap: "6px" }}
                              >

                                <div>MANAGE SUBSCRIPTION</div>
                              </Typography>
                            </Button>

                          )
                    }
                    {isHomePage ? (
                      <Button
                        reloadDocument
                        component={RouterLink}
                        to="/get-started"
                        sx={{
                          color: "primary.main",
                          display: "block",
                          bgcolor: "secondary.main",
                          my: "10px",
                          mx: "5px"
                        }}
                      >
                        <Typography
                          variant="body2Bold"
                          alignItems={"center"}
                          component="div"
                          sx={{ display: "flex", justifyContent: "end", gap: "6px" }}
                        >
                          <SvgIcon
                            component={Home}
                            inheritViewBox />
                          <div>HOME</div>
                        </Typography>
                      </Button>
                    ) : (
                      <Button
                        to="/get-started"
                        component={RouterLink}
                        sx={{
                          color: "secondary.main",
                          display: "block",
                          my: "5px"
                        }}
                      >
                        <Typography
                          variant="body2Bold"
                          component="div"
                          alignItems={"center"}
                          sx={{ display: "flex", justifyContent: "end", gap: "6px" }}
                        >
                          <SvgIcon
                            component={Home}
                            inheritViewBox />
                          <div>HOME</div>
                        </Typography>
                      </Button>
                    )}
                    {isSessionPage ? (
                      <Button
                        to="/session"
                        component={RouterLink}
                        reloadDocument
                        sx={{
                          display: "block",
                          color: "secondary.main",
                          "&:hover": {
                            color: "secondary.main",
                          },
                          bgcolor: "secondary.main",
                          my: "10px",
                          mx: "5px"
                        }}
                      >
                        <Typography
                          component="div"
                          alignItems={"center"}
                          sx={{ display: "flex", justifyContent: "end", gap: "6px" }}
                        >
                          <SvgIcon
                            component={MySessionBlue}
                            inheritViewBox />
                          <Typography component="div" variant="body2Bold" sx={{ color: "primary.main" }}>MYSESSION</Typography>
                        </Typography>
                      </Button>
                    ) : (
                      <Button
                        to="/session"
                        component={RouterLink}
                        sx={{
                          display: "block",
                          color: "primary.main",
                          "&:hover": {
                            color: "primary.main",
                          },
                          my: "5px"
                        }}
                      >
                        <Typography
                          component="div"
                          alignItems={"center"}
                          sx={{ display: "flex", justifyContent: "end", gap: "6px" }}
                        >
                          <SvgIcon
                            component={MySessionWhite}
                            inheritViewBox />
                          <Typography component="div" variant="body2Bold" sx={{ color: "secondary.main" }}>MYSESSION</Typography>
                        </Typography>
                      </Button>
                    )}
                    {isMymoodPage ? (
                      <Button
                        to="/mymood"
                        reloadDocument
                        component={RouterLink}
                        sx={{
                          color: "primary.main",
                          display: "block",
                          bgcolor: "secondary.main",
                          my: "10px",
                          mx: "5px"
                        }}
                      >
                        <Typography
                          variant="body2Bold"
                          component="div"
                          alignItems={"center"}
                          sx={{ display: "flex", justifyContent: "end", gap: "6px" }}
                        >
                          <SvgIcon
                            component={MyMood}
                            inheritViewBox />
                          <div>MYMOOD</div>
                        </Typography>
                      </Button>
                    ) : (
                      <Button
                        to="/mymood"
                        component={RouterLink}
                        sx={{
                          color: "secondary.main",
                          display: "block",
                          my: "5px"
                        }}
                      >
                        <Typography
                          variant="body2Bold"
                          component="div"
                          alignItems={"center"}
                          sx={{ display: "flex", justifyContent: "end", gap: "6px" }}
                        >
                          <SvgIcon
                            component={MyMood}
                            inheritViewBox />
                          <div>MYMOOD</div>
                        </Typography>
                      </Button>
                    )}
                    {user && role === 'user' && (
                      isTherapyPage ? (
                        <Button
                          reloadDocument
                          to="/book-therapist"
                          component={RouterLink}
                          sx={{
                            color: "primary.main",
                            display: "block",
                            bgcolor: "secondary.main",
                            my: "10px",
                            mx: "5px"
                          }}
                        >
                          <Typography
                            variant="body2Bold"
                            component="div"
                            alignItems={"center"}
                            sx={{ display: "flex", justifyContent: "end", gap: "6px" }}
                          >
                            <SvgIcon
                              component={PokaTherapy}
                              inheritViewBox />
                            <div>MYTHERAPY</div>
                          </Typography>
                        </Button>
                      ) : (
                        <Button
                          to="/book-therapist"
                          component={RouterLink}
                          sx={{
                            color: "secondary.main",
                            display: "block",
                            my: "5px"
                          }}
                        >
                          <Typography
                            variant="body2Bold"
                            component="div"
                            alignItems={"center"}
                            sx={{ display: "flex", justifyContent: "end", gap: "6px" }}
                          >
                            <SvgIcon
                              component={PokaTherapy}
                              inheritViewBox />
                            <div>MYTHERAPY</div>
                          </Typography>
                        </Button>
                      ))}
                    {user && role === 'therapist' && (
                      isTherapist ? (
                        <Button
                          to="/therapist-view"
                          component={RouterLink}
                          reloadDocument
                          sx={{
                            color: "primary.main",
                            display: "block",
                            bgcolor: "secondary.main",
                            my: "10px",
                            mx: "5px"
                          }}
                        >
                          <Typography
                            variant="body2Bold"
                            component="div"
                            alignItems={"center"}
                            sx={{ display: "flex", justifyContent: "end", gap: "6px" }}
                          >
                            <SvgIcon
                              component={PokaTherapy}
                              inheritViewBox />
                            <div>MYTHERAPY</div>
                          </Typography>
                        </Button>
                      ) : (
                        <Button
                          to="/therapist-view"
                          component={RouterLink}
                          sx={{
                            color: "secondary.main",
                            display: "block",
                            my: "5px"
                          }}
                        >
                          <Typography
                            variant="body2Bold"
                            component="div"
                            alignItems={"center"}
                            sx={{ display: "flex", justifyContent: "end", gap: "6px" }}
                          >
                            <SvgIcon
                              component={PokaTherapy}
                              inheritViewBox />
                            <div>MYTHERAPY</div>
                          </Typography>
                        </Button>
                      ))}
                    {isBlogPage ? (
                      <Button
                        to="/blogs"
                        component={RouterLink}
                        reloadDocument
                        sx={{
                          color: "primary.main",
                          display: "block",
                          bgcolor: "secondary.main",
                          my: "10px",
                          mx: "5px"
                        }}
                      >
                        <Typography
                          variant="body2Bold"
                          component="div"
                          alignItems={"center"}
                          sx={{ display: "flex", justifyContent: "end", gap: "6px" }}
                        >
                          <SvgIcon
                            component={Articles}
                            inheritViewBox />
                          <div>BLOGS</div>
                        </Typography>
                      </Button>
                    ) : (
                      <Button
                        to="/blogs"
                        component={RouterLink}
                        sx={{
                          color: "secondary.main",
                          display: "block",
                          my: "5px"
                        }}
                      >
                        <Typography
                          variant="body2Bold"
                          component="div"
                          alignItems={"center"}
                          sx={{ display: "flex", justifyContent: "end", gap: "6px" }}
                        >
                          <SvgIcon
                            component={Articles}
                            inheritViewBox />
                          <div>BLOGS</div>
                        </Typography>
                      </Button>
                  )}
                     {isCornerPage ? (
                      <Button
                        to="/calm-corner"
                        component={RouterLink}
                        reloadDocument
                        sx={{
                          color: "primary.main",
                          display: "block",
                          bgcolor: "secondary.main",
                          my: "10px",
                          mx: "5px"
                        }}
                      >
                        <Typography
                          variant="body2Bold"
                          component="div"
                          alignItems={"center"}
                          sx={{ display: "flex", justifyContent: "end", gap: "6px" }}
                        >
                          <SvgIcon
                            component={HeartBlue}
                            inheritViewBox />
                          <div>CALM CORNER</div>
                        </Typography>
                      </Button>
                    ) : (
                      <Button
                        to="/calm-corner"
                        component={RouterLink}
                        sx={{
                          color: "secondary.main",
                          display: "block",
                          my: "5px"
                        }}
                      >
                        <Typography
                          variant="body2Bold"
                          component="div"
                          alignItems={"center"}
                          sx={{ display: "flex", justifyContent: "end", gap: "6px" }}
                        >
                          <SvgIcon
                            component={HeartWhite}
                            inheritViewBox />
                          <div>CALM CORNER</div>
                        </Typography>
                      </Button>
                    )}
                    <Button
                      to="/sos"
                      component={RouterLink}
                      sx={{ alignSelf: "end" }}
                    >
                      <Typography color="#FFA1A1" variant="sb16Bold" textAlign={"end"}>SOS</Typography>
                    </Button>
                  </Grid>
                </div>
              </CSSTransition>
            </Grid>
            </>
          ) : (
            <Grid container flexDirection={"column"} justifyContent={"center"}>
            <Grid display={"flex"} justifyContent={"space-between"}>
              <Box display={"flex"} height={"50px"} width={"fit-content"} overflow={"hidden"} alignItems={"center"} >
                <SvgIcon component={IconBlue} inheritViewBox style={{width:"50px", height:"auto"}}/>
                {/* <SvgIcon component={FullBlue} inheritViewBox style={{width:"125px", height:"120px"}}/> */}
                <Typography
                  variant="sb24Bold"
                  component={RouterLink}
                  to="/get-started"
                  sx={{ color: "rgb(92, 131, 191)", textDecoration: 'none', paddingBottom:"5px" }}
                >
                  pokamind
                </Typography>
                {/*<Typography variant="body2SemiBold" sx={{ pb: 5, flexGrow: 1, color: "primary.darkerBlue" }}>BETA</Typography> */}
              </Box>
            <Grid className="navbar-dropdown" lg={3} md={4} sm={6} xs={6} justifySelf={"end"}>
              <Button
                to="/sos"
                component={RouterLink}
              >
                <Typography color="#BB5959" variant="sb16Bold">SOS</Typography>
              </Button>
              <Grid className="vertical-line" style={{ background: "#E3DBD5", height: "2rem" }} marginRight={1} marginLeft={0} alignSelf={"center"}/>
              {role !== "admin" && tier === "free" && !premium_status ? (
                <Button
                  to="/plans"
                  component={RouterLink}
                >
                  <Typography color="primary.main" variant="sb16Bold" >TRY PREMIUM</Typography>
                </Button>
              ) : (
                role !== "admin" && tier === "free" && premium_status ?
                  (<Button
                    href={process.env.REACT_APP_StripeCustomerPortal + `?prefilled_email=${user.email}`}
                  >
                    <Typography color="#BB5959" variant="sb16Bold" >Fix Subscription</Typography>
                  </Button>
                  ) : (
                    role !== "admin" && tier === "premium" &&
                    (<Button
                      href={process.env.REACT_APP_StripeCustomerPortal + `?prefilled_email=${user.email}`}
                    >
                      <Typography color="primary.main" variant="sb16Bold">Manage Subscription</Typography>
                    </Button>
                    ))
              )}
              {!isSmallerThan1100px && (
                <Typography
                  variant="body2Bold"
                  component="div"
                  sx={{ color: "primary.main", display: "flex", alignItems: "center", pl: 2 }}
                >
<UserDisplay user={user} />
                </Typography>
              )}

              <Dropdown>
                <Dropdown.Toggle variant="text" id="dropdown-basic">
                  <Avatar name={email || 'default'} size={32} variant="beam" />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {user ? (
                    <>
                      <Dropdown.Item onClick={() => navigate('/user-profile')}>MyProfile</Dropdown.Item>


                      <Dropdown.Item onClick={() => auth.signOut().then(() => {
                        localStorage.removeItem('user');
                        localStorage.removeItem('role');
                        sessionStorage.clear();
                        navigate('/');
                      }
                      )}>Sign Out</Dropdown.Item>
                      <Dropdown.Item onClick={handleDeleteAccount}>Delete Account</Dropdown.Item>
                    </>
                  ) : (
                    <Dropdown.Item onClick={() => navigate('/auth')}>Login</Dropdown.Item>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            </Grid>
            </Grid>
              <Grid container width={"fit-content"} sx={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center" }} position={isMedium ? "unset" : "absolute"} alignSelf={"center"}>                {isHomePage ? (
                  <Button
                    component={RouterLink}
                    reloadDocument
                    to="/get-started"
                    variant="header"
                  >
                    <SvgIcon component={Home} inheritViewBox />
                    <Typography variant="body2Bold">HOME</Typography>
                  </Button>
                ) : (
                  <Button
                    component={RouterLink}
                    to="/get-started"
                    sx={{
                      m: 0,
                      gap: "8px",
                      "&:hover": {
                        background: "none",
                      }
                    }}
                  >
                    <Box
                      sx={{
                        bgcolor: "primary.backgroundBlue",
                        width: "48px",
                        height: "48px",
                        borderRadius: "50%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                      }}
                    >
                      <SvgIcon component={Home} inheritViewBox fill="primary.main" />
                    </Box>
                    <Typography variant="body2Bold">HOME</Typography>
                  </Button>
                )}
                {isSessionPage ? (
                  <Button
                    component={RouterLink}
                    reloadDocument
                    to='/session'
                    variant="header"
                    sx={{
                      color: "primary.main",
                      "&:hover": {
                        color: "primary.main",
                      }
                    }}
                  >
                    <SvgIcon component={MySessionWhite} inheritViewBox />
                    <Typography variant="body2Bold" sx={{ color: "secondary.main" }}>MYSESSION</Typography>
                  </Button>
                ) : (
                  <Button
                    // href="/session"
                    onClick={() => navigate('/session')}
                    sx={{
                      m: 0,
                      gap: "8px",
                      color: "primary.backgroundBlue",
                      "&:hover": {
                        color: "primary.backgroundBlue",
                        background: "none"
                      }
                    }}
                  >
                    <Box
                      sx={{
                        bgcolor: "primary.backgroundBlue",
                        width: "48px",
                        height: "48px",
                        borderRadius: "50%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <SvgIcon component={MySessionBlue} inheritViewBox />
                    </Box>
                    <Typography variant="body2Bold" sx={{ color: "primary.main" }}>MYSESSION</Typography>
                  </Button>
                )}
                {isMymoodPage ? (
                  <Button
                    component={RouterLink}
                    reloadDocument
                    to="/mymood"
                    variant="header"
                  >
                    <SvgIcon component={MyMood} inheritViewBox />
                    <Typography variant="body2Bold">MYMOOD</Typography>
                  </Button>
                ) : (
                  <Button
                    component={RouterLink}
                    to="/mymood"
                    sx={{
                      m: 0,
                      gap: "8px",
                      "&:hover": {
                        background: "none",
                      }
                    }}
                  >
                    <Box
                      sx={{
                        bgcolor: "primary.backgroundBlue",
                        width: "48px",
                        height: "48px",
                        borderRadius: "50%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <SvgIcon component={MyMood} inheritViewBox fill="primary.main" />
                    </Box>
                    <Typography variant="body2Bold">MYMOOD</Typography>
                  </Button>
                )}
                {userLink} {therapistLink}
                {isBlogPage ? (
                  <Button
                  reloadDocument
                  component={RouterLink}
                  to="/blogs"
                  variant="header"
                >
                  <SvgIcon component={Articles} inheritViewBox />
                  <Typography variant="body2Bold">BLOGS</Typography>
                </Button>
              ) : (
                <Button
                  component={RouterLink}
                  to="/blogs"
                  sx={{
                    m: 0,
                    gap: "8px",
                    "&:hover": {
                      background: "none",
                    }
                  }}
                >
                  <Box
                    sx={{
                      bgcolor: "primary.backgroundBlue",
                      width: "48px",
                      height: "48px",
                      borderRadius: "50%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <SvgIcon component={Articles} inheritViewBox fill="primary.main" />
                  </Box>
                  <Typography variant="body2Bold">BLOGS</Typography>
                </Button>
              )}
                  {isCornerPage ? (
                    <Button
                    reloadDocument
                    component={RouterLink}
                    to="/calm-corner"
                    variant="header"
                  >
                    <SvgIcon component={HeartWhite} inheritViewBox />
                    <Typography variant="body2Bold">CALM CORNER</Typography>
                  </Button>
                  ) : (
                  <Button
                    component={RouterLink}
                    to="/calm-corner"
                    sx={{
                      m: 0,
                      gap: "8px",
                      "&:hover": {
                        background: "none",
                      }
                    }}
                  >
                    <Box
                      sx={{
                        bgcolor: "primary.backgroundBlue",
                        width: "48px",
                        height: "48px",
                        borderRadius: "50%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <SvgIcon component={HeartBlue} inheritViewBox fill="primary.main" />
                    </Box>
                    <Typography variant="body2Bold">CALM CORNER</Typography>
                  </Button>
              )}

              </Grid>
            </Grid>
          )}
        </Toolbar>
        <hr className="separator" />
      </AppBar>
    </>
  );
};

export default Navbar;
=======
import { AppBar, Toolbar, Typography } from "@mui/material";
import React from "react";
import Logo from "../data/logo.png";

const Navbar = () => {
    
    const handleRefresh = () => {
        window.location.reload();
    };

    return (
        <AppBar sx={{ display: "flex", alignItems: "center", backgroundColor: "#296573" }}>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between", width: { xs: "90%", sm: "80%" }, padding: "10px" }}>
                <img src={Logo} alt="Logo" width={"auto"} height={"45px"}  onClick={handleRefresh} style={{ cursor: "pointer" }}/>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
>>>>>>> a5699c56f54cdde9a3d3374645475ae6f5b2fcd3
