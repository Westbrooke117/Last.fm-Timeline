import {
    Box,
    Button, Input, Menu, MenuButton, MenuGroup, MenuItem, MenuList,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent, ModalFooter,
    ModalHeader,
    ModalOverlay,
    Text
} from "@chakra-ui/react";
import {
    Chart as ChartJS,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    LineElement,
    PointElement
} from "chart.js";
import {Bar, Line} from "react-chartjs-2";
import {useEffect, useState} from "react";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    PointElement
);
import { compareTwoStrings, findBestMatch } from "string-similarity"

ChartJS.defaults.color = '#efeff1'
ChartJS.defaults.borderColor = '#344153'

const AlbumChart = ({isOpen, onClose, chartData, getChartData, getArtistForAlbum, getAllAlbums}) => {
    const [chartDataset, setChartDataset] = useState([])
    const [activeChartAlbum, setActiveChartAlbum] = useState(null)
    const [isBarChart, toggleBarChart] = useState(true)

    const [albumList, setAlbumList] = useState([])

    useEffect(() => {
        setActiveChartAlbum(chartData.albumName)

        if (activeChartAlbum !== null){
            setChartDataset(getChartData(activeChartAlbum, isBarChart === true ? 'bar' : 'line'))
        }
    },[chartData, getChartData])

    useEffect(() => {
        setChartDataset(getChartData(activeChartAlbum, isBarChart === true ? 'bar' : 'line'))
    },[activeChartAlbum, isBarChart])

    const data = {
        labels: ['Jan', 'Feb', 'Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
        datasets: [
            {
                id: 1,
                label: '# of scrobbles',
                data: chartDataset,
                backgroundColor: '#90cdf4',
                borderRadius: 3,
                borderColor: '#90cdf4',
            },
        ],
    };

    const barOptions = {
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                mode: 'index',
                intersect: false,
            }
        },
        hover: {
            mode: 'nearest',
            intersect: true
        },
        scales: {
            x: {
                grid: {
                    display: false
                }
            },
            y: { suggestedMin: 0 }
        }
    };

    const lineOptions = {
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                mode: 'index',
                intersect: false,
            },
        },
        hover: {
            mode: 'nearest',
            intersect: true
        },
        scales: {
            x: {
                grid: {
                    display: false
                }
            },
            y: { suggestedMin: 0 }
        }
    };


 return (
     <Box>
         <Modal onClose={onClose} isOpen={isOpen}>
             <ModalOverlay />
             <ModalContent minW={750} h={'fit-content'}>
                 <ModalHeader display={'flex'} justifyContent={'center'} alignItems={'baseline'}>
                     {chartData.year} listening stats for {activeChartAlbum} by {getArtistForAlbum(activeChartAlbum)}
                     {
                         chartDataset.length !== 0 &&
                         <Menu placement={'right-start'} offset={[-16,30]} isLazy={true} lazyBehavior={"unmount"} closeOnBlur={false}>
                             <MenuButton ml={'auto'} onClick={() => setAlbumList(getAllAlbums())}>
                                 <Button mb={1} variant={'ghost'} colorScheme={'blue'}>
                                     Change
                                 </Button>
                             </MenuButton>
                             <MenuList maxHeight={400} maxWidth={50} overflowY={'scroll'}>
                                 {
                                     albumList &&
                                     albumList.map((album, index) => (
                                         <Box
                                             display={'flex'}
                                             justifyContent={'space-between'}
                                             alignItems={'center'}
                                             backgroundColor={activeChartAlbum === album.name ? 'gray.800' : 'rgba(0,0,0,0)'}
                                             onClick={() => setActiveChartAlbum(album.name)}
                                             className={'menu-item-list'}
                                         >
                                             <Box>
                                                 <Text
                                                     color={'gray.500'}
                                                     pl={3}
                                                     fontSize={12}
                                                 ><strong>{index+1}</strong></Text>
                                             </Box>
                                             <Box
                                                 pt={1}
                                                 pb={1}
                                                 pl={3}
                                                 pr={3}
                                                 marginRight={'auto'}
                                                 >
                                                 <Text fontSize={16} >{album.name}</Text>
                                                 <Text color={'gray.400'} fontSize={16}>{getArtistForAlbum(album.name)}</Text>
                                             </Box>
                                         </Box>
                                     ))
                                 }
                             </MenuList>
                         </Menu>
                     }
                 </ModalHeader>
                 <ModalBody maxH={375} minH={375}>
                     {
                         isBarChart === true ?
                             <Bar
                                 data={data}
                                 options={isBarChart === true ? barOptions : lineOptions}
                             />
                             :
                             <Line
                                 data={data}
                                 options={isBarChart === true ? barOptions : lineOptions}
                             />
                     }
                 </ModalBody>
                 <ModalFooter display={'flex'} justifyContent={'space-between'}>
                     <Button onClick={() => toggleBarChart(!isBarChart)}>{isBarChart === true ? <p>Switch to Cumulative</p> : <p>Switch to Monthly</p>}</Button>
                     <Button onClick={onClose}>Close</Button>
                 </ModalFooter>
             </ModalContent>
         </Modal>
     </Box>
 )
}

export {AlbumChart}