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

const AlbumGrid = ({year, month, user, storeMonthData, monthDataLoaded, storeAllMonthData, showChartModal, setChartDetails}) => {
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
        axios.get(`https://ws.audioscrobbler.com/2.0/?method=user.getweeklyalbumchart&user=${user}&api_key=82d112e473f59ade0157abe4a47d4eb5&format=json&from=${monthStart}&to=${monthEnd}`)
            .then((response) => {
                // Store all albums for chart population
                let allResponses = response.data.weeklyalbumchart.album
                storeAllMonthData(month-1 ,allResponses)

                // Only show top 16 albums (4x4) on the album grid
                let topAlbums = [...allResponses.slice(0, 16)]
                let monthAlbumData = topAlbums.map(async (album) => {
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

        async function getAlbumImages(artist, album, mbid) {
            try {
                const query = mbid
                    ? `mbid=${mbid}`
                    : `artist=${encodeURIComponent(artist)}&album=${encodeURIComponent(album)}`;

                const response = await axios.get(
                    `https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=82d112e473f59ade0157abe4a47d4eb5&format=json&${query}`
                );

                const images = response.data.album.image;

                const findImage = (preferredIndex) => {
                    for (let i = preferredIndex; i >= 0; i--) {
                        const url = images[i]?.['#text'];
                        if (url && url.trim() !== '') return url;
                    }
                    return undefined;
                };

                return {
                    small: findImage(0),
                    large: findImage(3),
                };
            } catch (error) {
                if (mbid) {
                    try {
                        const response = await axios.get(
                            `https://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=82d112e473f59ade0157abe4a47d4eb5&format=json&artist=${encodeURIComponent(artist)}&album=${encodeURIComponent(album)}`
                        );
                        const images = response.data.album.image;
                        const findImage = (preferredIndex) => {
                            for (let i = preferredIndex; i >= 0; i--) {
                                const url = images[i]?.['#text'];
                                if (url && url.trim() !== '') return url;
                            }
                            return undefined;
                        };
                        return { small: findImage(0), large: findImage(3) };
                    } catch {
                        return { small: undefined, large: undefined };
                    }
                }
                return { small: undefined, large: undefined };
            }
        }
    }, [user, year, month]);

    let gridSize = new Array(4).fill(0)

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
                                        {gridSize.map((row, rowIndex) => (
                                            <Tr key={rowIndex}>
                                                {gridSize.map((cell, colIndex) => {
                                                    const index = rowIndex * 4 + colIndex;
                                                    return monthData[index] === undefined ? null : (
                                                        <TableElement
                                                            key={colIndex}
                                                            artist={monthData[index].artist}
                                                            imageSmall={monthData[index].image.small}
                                                            imageLarge={monthData[index].image.large}
                                                            name={monthData[index].name}
                                                            url={monthData[index].url}
                                                            scrobbles={monthData[index].scrobbles}
                                                            showChartModal={showChartModal}
                                                            setChartDetails={setChartDetails}
                                                            year={year}
                                                        />
                                                    );
                                                })}
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