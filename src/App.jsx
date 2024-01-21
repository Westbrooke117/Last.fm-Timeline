import './App.css'
import {AlbumGrid} from "./components/AlbumGrid.jsx";
import {
    Box,
    Button,
    Container,
    Heading,
    HStack,
    Input,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    Text,
} from "@chakra-ui/react";
import {useEffect, useState} from "react";
import {ArrowBackIcon, ArrowDownIcon, ArrowForwardIcon, ArrowRightIcon} from '@chakra-ui/icons'

function App() {
    const [inputData, setInputData] = useState({
        username: "",
        year: 2023
    })

    const [data, setData] = useState({
        username: "",
        year: 2023
    })

    const calculateMonths = () => {
        if (data.year === new Date().getFullYear()){
            return new Date().getMonth()+1
        } else {
            return 12
        }
    }

    useEffect(() => {
        setInputData({...inputData, year: data.year})
    },[data.year])

  return (
    <>
        <Container maxW={'8xl'}>
            <form onSubmit={(e) => {
                e.preventDefault()
                setData({username: inputData.username, year: inputData.year})
            }}>
                <HStack mt={'50'} mb={1} justifyContent={'center'} alignItems={'center'}>
                    <Heading>Last.fm</Heading>
                    <NumberInput focusBorderColor={'gray.700'} variant={'filled'} defaultValue={2023} min={2002} max={new Date().getFullYear()} textAlign={'center'} w={'fit-content'} value={inputData.year} onChange={(value) => setInputData({...inputData, year: parseInt(value)})}>
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
                    <Input onChange={(e) => setInputData({...inputData, username: e.target.value})} maxW={'20%'} variant='filled' placeholder='enter a last.fm username' />
                    <Button variant={'ghost'} colorScheme='blue' type={'submit'}>Start</Button>
                </HStack>
            </form>
            <div>
                {
                    data.username &&
                    <>
                        {
                            new Array(calculateMonths()).fill(0).map((month, index) =>
                                <AlbumGrid
                                    key={`month${index+1}`}
                                    user={data.username}
                                    year={data.year}
                                    month={index+1}
                                />
                            )
                        }
                        {
                            new Date().getFullYear() === data.year ?
                                <HStack mt={10} mb={10} alignItems={'center'} justifyContent={'space-between'}>
                                    <a href={"#top"}>
                                        <Button  onClick={() => setData({...data, year: data.year-1})} leftIcon={<ArrowBackIcon />} fontSize={28} size={'lg'} colorScheme='blue' variant='ghost'>Last Year ({data.year-1})</Button>
                                    </a>
                                </HStack>

                                :
                                <HStack mt={8} mb={8} alignItems={'center'} justifyContent={'space-between'}>
                                    <a href={"#top"}>
                                        <Button onClick={() => setData({...data, year: data.year-1})} leftIcon={<ArrowBackIcon />} fontSize={28} size={'lg'} colorScheme='blue' variant='ghost'>Last Year ({data.year-1})</Button>
                                    </a>
                                    <a href={'#top'}>
                                        <Button onClick={() => setData({...data, year: data.year+1})} rightIcon={<ArrowForwardIcon />} fontSize={28} size={'lg'} colorScheme='blue' variant='ghost'>Next Year ({data.year+1})</Button>
                                    </a>
                                </HStack>
                        }
                        <hr/>
                        <div style={{display: 'flex', justifyContent: "center"}}>
                            <a href={"#top"}><Button mt={5} mb={5} size={'lg'} colorScheme='green' variant={'ghost'}>Go Back to Top</Button></a>
                        </div>
                    </>
                }
            </div>
        </Container>
    </>
  )
}

export default App
