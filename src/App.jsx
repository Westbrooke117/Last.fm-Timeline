import './App.css'
import {AlbumGrid} from "./components/AlbumGrid.jsx";
import {
    Button,
    Container,
    Heading,
    HStack,
    Input,
    Text,
} from "@chakra-ui/react";
import {useState} from "react";

function App() {
    const [username, setUsername] = useState("")
    const [inputText, setInputText] = useState("")
  return (
    <>
        <Container maxW={'8xl'}>
            <Heading mt={'50'} mb={1} textAlign={'center'}>Last.fm 2023 Timeline</Heading>
            <Text textAlign={'center'}>Monthly album 4x4's for everyone!</Text>
            <HStack mt={'5'} mb={'50'} justifyContent={'center'}>
                <Input onChange={(e) => setInputText(e.target.value)} maxW={'20%'} variant='filled' placeholder='enter a last.fm username' />
                <Button onClick={() => setUsername(inputText)} variant={'ghost'} colorScheme='blue'>Start</Button>
            </HStack>
            <div>
                {
                    username &&
                    <>
                        {
                            new Array(12).fill(0).map((month, index) =>
                                <AlbumGrid
                                    key={`month${index+1}`}
                                    user={username}
                                    year={2023}
                                    month={index+1}
                                />
                            )
                        }
                        <Heading textAlign={'center'} mt={10} mb={10}>⬇️ The Future? ⬇️</Heading><hr/>
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
