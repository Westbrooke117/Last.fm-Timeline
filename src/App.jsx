import './App.css'
import {
    Alert, AlertIcon,
    Box,
    Button,
    Container, Fade,
    Heading,
    HStack,
    Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper, Progress, SlideFade,
    Text,
} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import axios from "axios";
import {AlbumGrid} from "./components/AlbumGrid.jsx";
import {ArrowBackIcon, ArrowForwardIcon} from '@chakra-ui/icons'
import {MiniTimeline} from "./components/MiniTimeline.jsx";

//Google Analytics configuration
import ReactGA from "react-ga4";
import {AlbumChart} from "./components/AlbumChart.jsx";
ReactGA.initialize("G-CBYVZWEHHT");

const App = () => {
    //Used for form validation and setting data state
    const [inputData, setInputData] = useState({
        username: "",
        year: new Date(Date.now()).getFullYear(),
    })

    //Actual state used for API requests
    const [data, setData] = useState({
        username: "",
        year: new Date(Date.now()).getFullYear(),
    })

    // Store all data for a month
    const [chartDetails, setChartDetails] = useState({
        albumName: null,
        artistName: null,
        year: null
    })

    const [chartModalActive, toggleChartModal] = useState(false)
    const [fullMonthData, updateFullMonthData] = useState([
        {name: 'January', data: null},
        {name: 'February', data: null},
        {name: 'March', data: null},
        {name: 'April', data: null},
        {name: 'May', data: null},
        {name: 'June', data: null},
        {name: 'July', data: null},
        {name: 'August', data: null},
        {name: 'September', data: null},
        {name: 'October', data: null},
        {name: 'November', data: null},
        {name: 'December', data: null},
    ])

    const addToFullMonthData = (monthIndex, data) => {
        updateFullMonthData((prevData) => {
            const updatedData = [...prevData];
            updatedData[monthIndex].data = data;

            return updatedData;
        });
    }

    const getArtistForAlbum = (albumName) => {
        for (const monthIndex in fullMonthData){
            //Data not loaded
            if (fullMonthData[monthIndex].data === null) continue;

            const parentObject = fullMonthData[monthIndex].data.find((element) => element.name === albumName)

            // No match found this month, go to next
            if (parentObject === undefined) continue;

            return parentObject.artist['#text']
        }
    }

    const showChartModal = () => {
        toggleChartModal(true)
    }

    const getChartData = (albumName, chartType) => {
        let albumMonthlyScrobbles = []

        for (const monthIndex in fullMonthData){
            if (fullMonthData[monthIndex].data === null) continue;

            const albumData = fullMonthData[monthIndex].data.find((element) => element.name === albumName)

            if (albumData === undefined){
                albumMonthlyScrobbles.push(0)
            } else {
                albumMonthlyScrobbles.push(parseInt(albumData.playcount))
            }
        }

        // If bar chart then GET OUT
        if (chartType !== 'line') return albumMonthlyScrobbles

        let cumulativeAlbumScrobbles = []
        let runningTotal = 0

        for (let index = 0; index < albumMonthlyScrobbles.length; index++){
            runningTotal += albumMonthlyScrobbles[index]
            cumulativeAlbumScrobbles.push(runningTotal)
        }

        return cumulativeAlbumScrobbles
    }

    const getAllAlbums = () => {
        let allAlbums = []

        for (let monthIndex = 0; monthIndex < 11; monthIndex++){
            for (let albumIndex = 0; albumIndex < fullMonthData?.[monthIndex]?.data?.length; albumIndex++){
                try {
                    let albumName = fullMonthData[monthIndex].data[albumIndex].name
                    let albumArtist = fullMonthData[monthIndex].data[albumIndex].artist['#text']

                    let albumExistsInObject = allAlbums.find((element) => element.name === albumName)

                    if (!albumExistsInObject){
                        allAlbums.push({
                            name: albumName,
                            artist: albumArtist,
                            playcount: parseInt(fullMonthData[monthIndex].data[albumIndex].playcount)
                        })
                    } else {
                        albumExistsInObject.playcount += parseInt(fullMonthData[monthIndex].data[albumIndex].playcount)
                    }

                } catch (err){
                    break;
                }
            }
        }

        //Sort array by album playcount descending
        allAlbums.sort((a,b) => b.playcount - a.playcount)

        return(allAlbums)
    }

    const onClose = () => {
        toggleChartModal(false)
    }

    const [childrenLoading, setChildrenLoading] = useState(true)
    const [loadingPercent, updateLoadingPercentage] = useState(0)

    let totalMonths;
    let loadedMonths = 0;

    const monthDataLoaded = () => {
        loadedMonths += 1

        //Loading bar
        let currentLoadingPercentage = (loadedMonths / totalMonths * 100)
        updateLoadingPercentage(currentLoadingPercentage)

        // When loading is finished
        if (loadedMonths === totalMonths){
            setChildrenLoading(false)
        }
    }

    const [errorMessage, setErrorMessage] = useState("")
    const [hasError, setErrorState] = useState(false)
    const generateMonthArray = () => {
        let currentMonthInt = new Date().getMonth()+1

        let monthArray = new Array(data.year === currentYear ? currentMonthInt : 12).fill(0);
        totalMonths = monthArray.length;

        return monthArray;
    }

    // Mini Timeline will load a column when its corresponding album grid has finished loading
    const [miniTimelineData, setMiniTimelineData] = useState([])
    const StoreMonthData = (object) => {
        setMiniTimelineData((prevMiniTimelineData) => [...prevMiniTimelineData, object]);
    }

    useEffect(() => {
        //Reset chart state
        updateFullMonthData([
            {name: 'January', data: null},
            {name: 'February', data: null},
            {name: 'March', data: null},
            {name: 'April', data: null},
            {name: 'May', data: null},
            {name: 'June', data: null},
            {name: 'July', data: null},
            {name: 'August', data: null},
            {name: 'September', data: null},
            {name: 'October', data: null},
            {name: 'November', data: null},
            {name: 'December', data: null},
        ])

        setChildrenLoading(true)
        setMiniTimelineData([])
        setInputData({...inputData, year: data.year})
    },[data.year])

    const FormErrorChecker = async (name) => {
        // To comply with last.fm username conventions
        if (name.length > 15 || name.length < 2) {
            setErrorMessage("Username must be between 2 and 15 characters");
            return false;
        }

        const pattern = /^[a-zA-Z][a-zA-Z0-9_-]*$/;
        if (!pattern.test(name)) {
            setErrorMessage("Username must begin with a letter and contain only letters, numbers, '_' or '-'");
            return false;
        }

        // To ensure user actually exists
        try {
            await axios.get(`https://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=${name}&api_key=82d112e473f59ade0157abe4a47d4eb5&format=json`)
            setErrorMessage("");
            return true;
        } catch (error) {
            setErrorMessage("User not found");
            return false;
        }
    };

    function idAscending( a, b ) {
        if ( a.id < b.id ){
            return -1;
        }
        if ( a.id > b.id ){
            return 1;
        }
        return 0;
    }

    let currentYear = new Date().getFullYear()

  return (
    <>
        <Container maxW={'8xl'}>
            <form onSubmit={async (e) => {
                e.preventDefault()
                const inputIsValid = await FormErrorChecker(inputData.username);
                if (inputIsValid) {
                    setErrorState(false);
                    setData({ username: inputData.username, year: inputData.year });
                    setChildrenLoading(true)
                } else {
                    setErrorState(true);
                }
            }}>
                <HStack mt={'50'} mb={1} justifyContent={'center'} alignItems={'center'}>
                    <Heading>Last.fm</Heading>
                    <NumberInput focusBorderColor={'gray.700'} variant={'filled'} defaultValue={2024} min={2002} max={new Date().getFullYear()} textAlign={'center'} w={'fit-content'} value={inputData.year} onChange={(value) => setInputData({...inputData, year: parseInt(value)})}>
                        <NumberInputField color={"blue.200"} backgroundColor={'gray.700'} fontWeight={'bold'} fontSize={36} maxLength={4} maxW={135} mt={1} pb={3} pt={2}/>
                        <NumberInputStepper>
                            <NumberIncrementStepper mt={1}/>
                            <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>
                    <Heading>Timeline</Heading>
                </HStack>
                <Text mt={-1} textAlign={'center'}>Monthly album 4x4's for everyone!</Text>
                <HStack mt={'5'} mb={'50'} justifyContent={'center'}>
                    <Input onChange={(e) => {
                        setInputData({...inputData, username: e.target.value})
                        setErrorState(false)
                    }} maxW={'20%'} variant='filled' placeholder='enter a last.fm username' />
                    <Button variant={'ghost'} colorScheme='blue' type={'submit'}>Start</Button>
                </HStack>
                <Fade in={loadingPercent !== 100 && data.username}>
                    <Progress size={'xs'} value={loadingPercent} />
                </Fade>
            </form>
            {
                errorMessage === "" ?
                    <></>
                :
                    <SlideFade in={hasError}>
                        <Box display={'flex'} justifyContent={'center'}>
                            <Alert status='error' mt={-6} borderRadius={10} maxW={500}>
                                <AlertIcon/>
                                {errorMessage}
                            </Alert>
                        </Box>
                    </SlideFade>

            }
            <div>
                {
                    <SlideFade in={!childrenLoading}>
                        <Box>
                            {
                                generateMonthArray().map((month, index) =>
                                    <AlbumGrid
                                        key={`month${index+1}`}
                                        user={data.username}
                                        year={data.year}
                                        month={index+1}
                                        storeMonthData={StoreMonthData}
                                        monthDataLoaded={monthDataLoaded}
                                        storeAllMonthData={addToFullMonthData}
                                        showChartModal={showChartModal}
                                        setChartDetails={setChartDetails}
                                    />
                                )
                            }
                            <AlbumChart
                                isOpen={chartModalActive}
                                onClose={onClose}
                                chartData={chartDetails}
                                getChartData={getChartData}
                                getAllAlbums={getAllAlbums}
                                setChartData={setChartDetails}
                                getArtistForAlbum={getArtistForAlbum}
                                fullMonthData={fullMonthData}
                            />
                            <MiniTimeline
                                data={miniTimelineData.sort(idAscending)}
                                showChartModal={showChartModal}
                                setChartDetails={setChartDetails}
                                year={data.year}
                                user={data.username}
                            />
                            <Box mt={6}><hr/></Box>
                            {
                                currentYear === data.year ?
                                    <HStack mt={10} mb={10} alignItems={'center'} justifyContent={'space-between'}>
                                        <a href={"#top"}>
                                            <Button  onClick={() => setData({...data, year: data.year-1})} leftIcon={<ArrowBackIcon />} fontSize={28} size={'lg'} fontWeight={'bold'} colorScheme='blue' variant='ghost'>Last Year ({data.year-1})</Button>
                                        </a>
                                        <div style={{display: 'flex', justifyContent: "center"}}>
                                            <a href={"#top"}><Button size={'lg'} colorScheme='green' variant={'ghost'}>Go Back to Top</Button></a>
                                        </div>

                                        {/*To maintain alignment*/}
                                        <a href={'#top'} style={{visibility: 'hidden'}}>
                                            <Button onClick={() => setData({...data, year: data.year+1})} rightIcon={<ArrowForwardIcon />} fontSize={28} fontWeight={'bold'} size={'lg'} colorScheme='blue' variant='ghost'>Next Year ({data.year+1})</Button>
                                        </a>
                                    </HStack>

                                    :

                                    <HStack mt={10} mb={10} alignItems={'center'} justifyContent={'space-between'}>
                                        <a href={"#top"}>
                                            <Button onClick={() => setData({...data, year: data.year-1})} leftIcon={<ArrowBackIcon />} fontSize={28} fontWeight={'bold'} size={'lg'} colorScheme='blue' variant='ghost'>Last Year ({data.year-1})</Button>
                                        </a>
                                        <div style={{display: 'flex', justifyContent: "center"}}>
                                            <a href={"#top"}><Button size={'lg'} colorScheme='green' variant={'ghost'}>Go Back to Top</Button></a>
                                        </div>
                                        <a href={'#top'}>
                                            <Button onClick={() => setData({...data, year: data.year+1})} rightIcon={<ArrowForwardIcon />} fontSize={28} fontWeight={'bold'} size={'lg'} colorScheme='blue' variant='ghost'>Next Year ({data.year+1})</Button>
                                        </a>
                                    </HStack>
                            }
                        </Box>
                    </SlideFade>
                }
            </div>
        </Container>
    </>
  )
}

export default App
