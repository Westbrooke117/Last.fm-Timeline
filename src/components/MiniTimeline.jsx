import {HStack, VStack, Image, Tag, Tooltip} from "@chakra-ui/react";

const MiniTimeline = (props) => {
    return (
        <>
            <HStack mt={10} display={'flex'} justifyContent={'center'}>
                <VStack>
                    <p>#</p>
                    <Tag textAlign={'center'} color={'gray.800'} w={10} h={106} backgroundColor={'#ffd700'}><strong>1st</strong></Tag>
                    <Tag textAlign={'center'} color={'gray.800'} w={10} h={106} backgroundColor={'silver'}><strong>2nd</strong></Tag>
                    <Tag textAlign={'center'} w={10} h={106} backgroundColor={'#CD7F32'}><strong>3rd</strong></Tag>
                    <Tag textAlign={'center'} w={10} h={106}>4th</Tag>
                    <Tag textAlign={'center'} w={10} h={106}>5th</Tag>
                </VStack>
                {props.data.map((month) => (
                    <VStack key={month.id}>
                        <p>{month.monthText}</p>
                        {month.albums && month.albums.length > 0 ? (
                            month.albums.map((album, index) => (
                                <Tooltip textAlign={'center'} label={
                                    <>
                                        {album.name} - {album.artist}
                                        <br/>
                                        <strong>{album.scrobbles} {album.scrobbles === 1 ? "scrobble" : "scrobbles"}</strong>
                                    </>
                                } placement={'bottom'} hasArrow={true}>
                                    <Image
                                        h={106}
                                        alt={album.name}
                                        key={index}
                                        borderRadius={5}
                                        src={album.image} // Assuming the image is nested inside the 'image' property
                                    />
                                </Tooltip>
                            ))
                        ) : (
                            <p>No albums available for this month</p>
                        )}
                    </VStack>
                ))}
            </HStack>
        </>
    );
};

export { MiniTimeline };