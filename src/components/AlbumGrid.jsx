import axios from "axios";
import {useEffect, useRef, useState} from "react";
import {
    Box,
    Fade,
    Heading, Link,
    Table,
    TableContainer,
    Tbody,
    Td,
    Tr
} from "@chakra-ui/react";
import {TableElement} from "./TableElement.jsx";
import {ComponentImageExport} from "../ComopnentImageExport.jsx";

const AlbumGrid = ({year, month, user, storeMonthData, monthDataLoaded}) => {
    const [monthData, setMonthData] = useState([{}])
    let months = ["January","February","March","April","May","June","July","August","September","October","November","December"]

    const formatDate = () => {
        const startOfMonth = Date.UTC(year, month-1, 1) / 1000;
        const endOfMonth = Date.UTC(year, month, 1) / 1000;

        return [startOfMonth, endOfMonth];
    };

    const [monthStart, monthEnd] = formatDate();


    useEffect(() => {
        setMonthData([{}])
        axios.get(`https://ws.audioscrobbler.com/2.0/?method=user.getweeklyalbumchart&user=${user}&api_key=82d112e473f59ade0157abe4a47d4eb5&format=json&limit=16&from=${monthStart}&to=${monthEnd}`)
            .then((response) => {
                let monthAlbumData = response.data.weeklyalbumchart.album.map(async (album) => {
                    const { small, large } = await getAlbumImages(album.artist['#text'], album.name, album.mbid);
                    return {
                        name: album.name,
                        url: album.url,
                        scrobbles: parseInt(album.playcount),
                        artist: album.artist['#text'],
                        image: { small, large },
                        musicbrainzId: album.mbid
                    };
                });

                // Use Promise.all to wait for all images to be fetched
                Promise.all(monthAlbumData)
                    .then(data => {
                        storeMonthData({
                            id: month-1,
                            monthText: months[month-1].substring(0,3),
                            albums: data.slice(0, 5).map((item) => ({
                                name: item?.name,
                                artist: item?.artist,
                                scrobbles: item?.scrobbles,
                                url: item?.url,
                                image: item?.image?.large
                            }))
                        })
                        setMonthData(data)
                        monthDataLoaded()
                    })
                    .catch(error => console.error(error));
            });

        async function getAlbumImages(artist, album) {
            try {
                const response = await axios.get(`https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=82d112e473f59ade0157abe4a47d4eb5&format=json&artist=${encodeURIComponent(artist)}&album=${encodeURIComponent(album)}`);
                return {
                    small: response.data.album.image[0]['#text'],
                    large: response.data.album.image[3]['#text']
                };
            } catch (error) {
                return {
                    small: undefined,
                    large: undefined
                };
            }
        }
    }, [user, year]);

    let gridSize = new Array(4).fill(0)
    let cellIndex = 0;

    let headingAlignment = 'left';
    if (month % 2 !== 0) headingAlignment = 'right'

    const gridRef = useRef(null)


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
                { headingAlignment === "right" ?
                    <>
                        <Heading
                            textAlign={'left'}
                            maxW={1200}
                            pb={2}
                        >
                            {months[month - 1]}
                        </Heading>
                    </>
                    :
                    <>
                        <Heading
                            textAlign={'right'}
                            maxW={1200}
                            pb={2}
                        >
                            {months[month - 1]}
                        </Heading>
                    </>
                }
                <hr style={{ paddingBottom: "15px" }} />
                {
                    monthData[1] ?
                    <>
                        <TableContainer borderRadius={10} ref={gridRef}>
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
                                                            imageSmall={monthData[cellIndex].image.small}
                                                            imageLarge={monthData[cellIndex].image.large}
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
                        <Link color={'gray.500'} mt={3} display={'flex'} justifyContent={'center'} onClick={() =>
                            ComponentImageExport({
                                ref: gridRef.current,
                                component: 'album-grid',
                                username: user,
                                year: year,
                                month: month})
                        }
                        >Save as Image</Link>
                    </>
                     :
                        <TableContainer borderRadius={10}>
                            <Table size={"sm"} variant={"unstyled"} maxW={1200}>
                                <Tbody>
                                    <Tr>
                                        <Td w={300} h={150}></Td>
                                        <Td w={300} h={150}></Td>
                                        <Td w={300} h={150}></Td>
                                        <Td w={300} h={150}></Td>
                                    </Tr>
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