import './App.css'
import {
    Alert, AlertIcon,
    Box,
    Button,
    Container, Fade,
    Heading,
    HStack,
    Input,
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
import * as htmlToImage from "html-to-image";

import ReactGA from "react-ga4";
ReactGA.initialize("G-CBYVZWEHHT");

function App() {
    const exportAsPng = (ref, user, year, month, config) => {
        if (ref) {
            let options;
            switch (config){
                case 'grid':
                    options = {
                        style: {
                            borderRadius: 0
                        },
                        canvasWidth: 1200,
                        canvasHeight: 1200
                    }

                    htmlToImage.toPng(ref, options)
                        .then(function (dataUrl) {
                            const link = document.createElement('a');
                            link.href = dataUrl;
                            link.download = `${user}_${year}_${month.toString().padStart(2,'0')}`;
                            link.click();
                        })
                        .catch(function (error) {
                            console.error('Oops, something went wrong!', error);
                        });
                    break;
                case 'mini-timeline':
                    options = {
                        style: {
                          width: 'fit-content',
                            borderRadius: 0
                        },
                        pixelRatio: 2,
                    }

                    htmlToImage.toPng(ref, options)
                        .then(function (dataUrl) {
                            const link = document.createElement('a');
                            link.href = dataUrl;
                            link.download = `${user}_${year}`;
                            link.click();
                        })
                        .catch(function (error) {
                            console.error('Oops, something went wrong!', error);
                        });
                    break;
            }
        }
    };

    //Used for form validation and setting proper state
    const [inputData, setInputData] = useState({
        username: "",
        year: 2024
    })
    let unixTimeRegistered;

    //Actual state used for API requests
    const [data, setData] = useState({
        username: "",
        year: 2024
    })

    const [childrenLoading, setChildrenLoading] = useState(true)
    const [loadingPercent, updateLoadingPercentage] = useState(0)

    let totalMonths;
    let loadedMonths = 0;

    const handleChildLoading = () => {
        loadedMonths += 1

        let currentLoadingPercentage = (loadedMonths / totalMonths * 100)
        updateLoadingPercentage(currentLoadingPercentage)

        if (loadedMonths === totalMonths){
            setChildrenLoading(false)
        }
    }

    const [errorMessage, setErrorMessage] = useState("")
    const [hasError, setErrorState] = useState(false)
    const generateMonthArray = () => {
        let currentMonth = new Date().getMonth()+1

        let monthArray = new Array(data.year === currentYear ? currentMonth : 12).fill(0);
        totalMonths = monthArray.length;

        return monthArray;
    }

    useEffect(() => {
        setChildrenLoading(true)
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
            const response = await axios.get(`https://ws.audioscrobbler.com/2.0/?method=user.getinfo&user=${name}&api_key=82d112e473f59ade0157abe4a47d4eb5&format=json`)
            unixTimeRegistered = {
                year: new Date(response.data.user.registered['#text']*1000).getFullYear(),
                month: new Date(response.data.user.registered['#text']*1000).getMonth()
            }
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

    const [miniTimelineData, setMiniTimelineData] = useState([])
    let tempData = [];
    const StoreMonthData = (object) => {
        tempData.push(object)
        setMiniTimelineData(tempData)
    }

    let currentYear = new Date().getFullYear()

  return (
    <>
        <Container maxW={'8xl'}>
            <form onSubmit={async (e) => {
                e.preventDefault()
                const inputIsValid = await FormErrorChecker(inputData.username);
                if (inputIsValid) {
                    setChildrenLoading(true)
                    setData({ username: inputData.username, year: inputData.year });
                    setErrorState(false);
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
                                        handleLoading={handleChildLoading}
                                        saveAsImage={exportAsPng}
                                        doesAlbumImageExistAlready={DoesAlbumImageExistAlready}
                                        cacheAlbumImageURL={CacheAlbumImageURL}
                                    />
                                )
                            }
                            <MiniTimeline
                                data={miniTimelineData.sort(idAscending)}
                                saveAsImage={exportAsPng}
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
