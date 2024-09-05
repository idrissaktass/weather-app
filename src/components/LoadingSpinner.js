import { CircularProgress, Grid2, Typography } from "@mui/material"

const LoadingSpinner = () => {

    return(
        <Grid2 display={"flex"} flexDirection={"column"} alignItems={"center"} justifyContent={"center"} minHeight={"100%"} gap={"20px"}>
            <CircularProgress size={70}/>
            <Typography fontSize={"24px"} fontWeight={600}>Loading...</Typography>
        </Grid2>
    )
}

export default LoadingSpinner;