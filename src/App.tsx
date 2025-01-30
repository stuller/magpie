import {useState, useEffect, FormEvent} from "react";
import {
    Authenticator,
    Button,
    Text,
    TextField,
    Heading,
    Flex,
    View,
    Image,
    Grid,
    Divider,
} from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import { getUrl, uploadData } from "aws-amplify/storage";
import { generateClient } from "aws-amplify/data";
import outputs from "../amplify_outputs.json";
import { type Schema } from "../amplify/data/resource";
/**
 * @type {import('aws-amplify/data').Client<import('../amplify/data/resource').Schema>}
 */

Amplify.configure(outputs);
const client = generateClient<Schema>({
    authMode: "userPool",
});

interface ISupply {
    id: string|null,
    cost: number|null,
    gauge: number|null,
    image: string|URL|null,
    length: number|null,
    material: string|null,
    name: string|null,
    type: string|null,
    unit: string|null,
    width: number|null,
}

export default function App() {
    const [supplies, setSupplies] = useState<ISupply[]>([]);

    useEffect(() => {
        fetchSupplies();
    }, []);

    async function fetchSupplies() {
        const { data: supplies } = await client.models.Supply.list();
        await Promise.all(
            supplies.map(async (supply: ISupply) => {
                if (supply.image) {
                    const linkToStorageFile = await getUrl({
                        path: ({ identityId }) => `media/${identityId}/${supply.image}`,
                    });
                    console.log(linkToStorageFile.url);
                    supply.image = linkToStorageFile.url;
                }
                return supply;
            })
        );
        console.log(supplies);
        setSupplies(supplies);
    }

    async function createSupply(event: React.FormEvent<HTMLFormElement>) { //TODO fix this any later
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        const image = form.get("image");
        console.log(form.get("image"))
        const cost = form.get("cost");
        const gauge = form.get("gauge");
        const length = form.get("length");
        const width = form.get("width");
        const { data: newSupply } = await client.models.Supply.create({
            cost: cost ? +cost : null,
            gauge: gauge ? +gauge : null,
            length: length ? +length : null,
            material: form.get("material") as string ?? null,
            name: form.get("name") as string ?? null,
            type: form.get("type") as string ?? null,
            unit: form.get("unit") as string ?? null,
            width: width ? +width : null,
            image: image instanceof File ? image.name : null,

        });

        console.log(newSupply);
        if (newSupply?.image) {
            await uploadData({
                path: ({identityId}) => `media/${identityId}/${newSupply.image}`,

                // @ts-expect-error figure out why data doesn't like image type
                data: image,
            }).result;
        }

        await fetchSupplies();
        event.currentTarget.reset();
    }

    async function deleteSupply(supply: ISupply) {
        const {id} = supply
        if(id) {
            const toBeDeletedSupply = {
                id: id,
            };

            const { data: deletedSupply } = await client.models.Supply.delete(
                toBeDeletedSupply
            );
            console.log(deletedSupply);

            await fetchSupplies();
        }
    }

    return (
        <Authenticator>
            {({ signOut }) => (
                <Flex
                    className="App"
                    justifyContent="center"
                    alignItems="center"
                    direction="column"
                    width="70%"
                    margin="0 auto"
                >
                    <Heading level={1}>Magpie Supplies</Heading>
                    <View as="form" margin="3rem 0" onSubmit={createSupply}>
                        <Flex
                            direction="column"
                            justifyContent="center"
                            gap="2rem"
                            padding="2rem"
                        >
                            <TextField
                                name="name"
                                placeholder="Supply Name"
                                label="Supply Name"
                                labelHidden
                                variation="quiet"
                                required
                            />
                            <TextField
                                name="type"
                                placeholder="Supply Type"
                                label="Supply Type"
                                labelHidden
                                variation="quiet"
                                required
                            />
                            <TextField
                                name="unit"
                                placeholder="Supply Unit"
                                label="Supply Unit"
                                labelHidden
                                variation="quiet"
                                required
                            />
                            <TextField
                                name="material"
                                placeholder="Supply Material"
                                label="Supply Material"
                                labelHidden
                                variation="quiet"
                                required
                            />
                            <TextField
                                name="gauge"
                                placeholder="Supply Gauge"
                                label="Supply Gauge"
                                labelHidden
                                variation="quiet"
                                required
                            />
                            <TextField
                                name="length"
                                placeholder="Supply Length"
                                label="Supply Length"
                                labelHidden
                                variation="quiet"
                                required
                            />
                            <TextField
                                name="width"
                                placeholder="Supply Width"
                                label="Supply Width"
                                labelHidden
                                variation="quiet"
                                required
                            />
                            <TextField
                                name="cost"
                                placeholder="Supply Cost"
                                label="Supply Cost"
                                labelHidden
                                variation="quiet"
                                required
                            />
                            <View
                                name="image"
                                as="input"
                                type="file"
                                alignSelf={"end"}
                                accept="image/png, image/jpeg"
                            />

                            <Button type="submit" variation="primary">
                                Create Supply
                            </Button>
                        </Flex>
                    </View>
                    <Divider />
                    <Heading level={2}>Current Supplies</Heading>
                    <Grid
                        margin="3rem 0"
                        autoFlow="column"
                        justifyContent="center"
                        gap="2rem"
                        alignContent="center"
                    >
                        {supplies.map((supply: ISupply) => (
                            <Flex
                                key={supply.id ?? supply.name}
                                direction="column"
                                justifyContent="center"
                                alignItems="center"
                                gap="2rem"
                                border="1px solid #ccc"
                                padding="2rem"
                                borderRadius="5%"
                                className="box"
                            >
                                <View>
                                    <Heading level={3}>{supply.name}</Heading>
                                </View>
                                <Text fontStyle="italic">{supply.type}</Text>
                                <Text fontStyle="italic">{supply.unit}</Text>
                                <Text fontStyle="italic">{supply.material}</Text>
                                <Text fontStyle="italic">{supply.gauge}</Text>
                                <Text fontStyle="italic">{supply.length}</Text>
                                <Text fontStyle="italic">{supply.width}</Text>
                                <Text fontStyle="italic">{supply.cost}</Text>
                                {supply.image && (
                                    <Image
                                        src={supply.image as string}
                                        alt={`visual aid for ${supply.name}`}
                                        style={{ width: 400 }}
                                    />
                                )}
                                <Button
                                    variation="destructive"
                                    onClick={() => deleteSupply(supply)}
                                >
                                    Delete supply
                                </Button>
                            </Flex>
                        ))}
                    </Grid>
                    <Button onClick={signOut}>Sign Out</Button>
                </Flex>
            )}
        </Authenticator>
    );
}