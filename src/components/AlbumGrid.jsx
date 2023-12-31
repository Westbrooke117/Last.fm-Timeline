import axios from "axios";
import {useEffect, useState} from "react";
import {Box, Fade, Heading, SlideFade, Table, TableContainer, Tbody, Td, Text, Tr} from "@chakra-ui/react";
import {TableElement} from "./TableElement.jsx";

const AlbumGrid = (props) => {
    const [monthData, setMonthData] = useState([{}])
    let months = ["January","February","March","April","May","June","July","August","September","October","November","December"]

    const month = props.month;
    const year = props.year;

    const formatDate = () => {
        let strMonth = month.toString();
        let nextMonth = (month+1).toString()

        if (strMonth.length === 1 && strMonth !== '9'){
            strMonth = `0${month}`
            nextMonth = `0${month+1}`
        }

        console.log(nextMonth === '13' ? (`${year+1}-01-01`) : (`${year}-${nextMonth}-01`))

        return [
            Date.parse(`${year}-${strMonth}-01`)/1000,
            nextMonth === '13' ? Date.parse(`${year+1}-01-01`)/1000 : Date.parse(`${year}-${nextMonth}-01`)/1000
        ]
    }
    const [monthStart, monthEnd] = formatDate()

    useEffect(() => {
        setMonthData([{}])
        axios.get(`https://ws.audioscrobbler.com/2.0/?method=user.getweeklyalbumchart&user=${props.user}&api_key=82d112e473f59ade0157abe4a47d4eb5&format=json&limit=16&from=${monthStart}&to=${monthEnd}`)
            .then((response) => {
                let monthAlbumData = response.data.weeklyalbumchart.album.map(async (album) => {
                    const imgURL = await getAlbumImage(album.artist['#text'], album.name);
                    return {
                        name: album.name,
                        url: album.url,
                        scrobbles: parseInt(album.playcount),
                        artist: album.artist['#text'],
                        image: imgURL
                    };
                });

                // Use Promise.all to wait for all images to be fetched
                Promise.all(monthAlbumData)
                    .then(data => {
                        // console.log(data)
                        setMonthData(data)
                    })
                    .catch(error => console.error(error));
            });

        function getAlbumImage(artist, album) {
            return axios.get(`https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=82d112e473f59ade0157abe4a47d4eb5&format=json&artist=${artist}&album=${album}`)
                .then(response => response.data.album.image[3]['#text'])
                .catch(error => undefined)
        }
    },[props.user])

    let gridSize = new Array(4).fill(0) //4
    let cellIndex = 0;

    let headingAlignment = 'left';
    if (props.month % 2 !== 0) headingAlignment = 'right'

    return (
        <Box display={"flex"}>
            {headingAlignment === "right" && (
                <>
                    <Box w={"1200px"}></Box>
                    <Box
                        width={"100px"}
                        display={"flex"}
                        justifyContent={"center"}
                    >
                        <div
                            style={{
                                height: "100%",
                                width: "2px",
                                backgroundColor: "white",
                            }}
                        ></div>
                    </Box>
                </>
            )}
            <Box maxW={"1200px"}>
                {/* eslint-disable-next-line react/prop-types */}
                <Heading
                    maxW={1200}
                    textAlign={headingAlignment === "right" ? "left" : "right"}
                    pb={2}
                >
                    {months[props.month - 1]}
                </Heading>
                <hr style={{ paddingBottom: "15px" }} />
                {
                    monthData[1] !== undefined ?
                        <TableContainer>
                            <Fade in={true}>
                                <Table size={"sm"} variant={"unstyled"} maxW={1200}>
                                    <Tbody>
                                        {gridSize.map((row, index) => (
                                            <Tr key={index}>
                                                {gridSize.map((cell, index2) => (
                                                    monthData[cellIndex] === undefined ?
                                                        <></>
                                                        :
                                                        <TableElement
                                                            key={index2}
                                                            artist={monthData[cellIndex].artist}
                                                            image={monthData[cellIndex].image}
                                                            name={monthData[cellIndex].name}
                                                            url={monthData[cellIndex].url}
                                                            scrobbles={monthData[cellIndex++].scrobbles}
                                                        />
                                                ))}
                                            </Tr>
                                        ))}
                                    </Tbody>
                                </Table>
                            </Fade>
                        </TableContainer>
                        :
                        <TableContainer>
                            <Table size={"sm"} variant={"unstyled"} maxW={1200}>
                                <Tbody>
                                    {gridSize.map((row, index) => (
                                        <Tr key={index}>
                                            {
                                                gridSize.map((cell, index2) => (
                                                    <Td w={300} h={168.967}></Td>
                                                ))
                                            }
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        </TableContainer>
                }
            </Box>
            {headingAlignment === "left" && (
                <>
                    <Box
                        width={"100px"}
                        display={"flex"}
                        justifyContent={"center"}
                    >
                        <div
                            style={{
                                height: "100%",
                                width: "2px",
                                backgroundColor: "white",
                            }}
                        ></div>
                    </Box>
                    <Box w={"1200px"}></Box>
                </>
            )}
        </Box>
    );
}

export { AlbumGrid }