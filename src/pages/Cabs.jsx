import { Button, Card, CardBody, CardFooter, Heading, Image, Stack } from '@chakra-ui/react'
import React, { Fragment } from 'react'

const Cabs = () => {
    return (
        <Fragment>
            <div>Cabs</div>
            <p>Search Result...</p>
            <div>
                <Card
                    direction={{ base: 'column', sm: 'row' }}
                    overflow='hidden'
                    variant='outline'
                >
                    <Image
                        objectFit='cover'
                        maxW={{ base: '100%', sm: '200px' }}
                        src='https://images.91wheels.com/assets/c_images/gallery/maruti/dzire/maruti-dzire-0-1698069091.jpg?w=1200&q=60?w=3840&q=60'
                        alt='Car'
                    />

                    <Stack>
                        <CardBody>
                            <Heading size='md'>Desire</Heading>
                            <p>4 Seater</p>
                            <p>AC</p>
                            <p>Owner:Pankaj</p>


                            

                            
                        </CardBody>

                        <CardFooter>
                            <Button variant='solid' colorScheme='blue'>
                                Buy Latte
                            </Button>
                        </CardFooter>
                    </Stack>
                </Card>
            </div>
        </Fragment>

    )
}

export default Cabs