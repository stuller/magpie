import {useState, useEffect} from "react";
import {Authenticator} from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import { getUrl } from "aws-amplify/storage";
import { generateClient } from "aws-amplify/data";
import outputs from "../amplify_outputs.json";
import { type Schema } from "../amplify/data/resource";
import SupplyList, {ISupply} from "./components/supplies/SupplyList.tsx";
import CreateSupplyModal from "./components/supplies/CreateSupplyModal.tsx";
import {Button, Grid, IconButton, Typography} from "@mui/joy";
import AddBoxIcon from '@mui/icons-material/AddBox';
/**
 * @type {import('aws-amplify/data').Client<import('../amplify/data/resource').Schema>}
 */

Amplify.configure(outputs);
const client = generateClient<Schema>({
    authMode: "userPool",
});



export default function App() {
    const [supplies, setSupplies] = useState<ISupply[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);

    useEffect(() => {
        (async () => {
            await fetchSupplies();
        })()
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
        setSupplies(supplies);
    }

    const deleteSupply = async (supply: ISupply)=> {
        const {id} = supply
        if(id) {
            await client.models.Supply.delete({id});
            await fetchSupplies();
        }
    }

    const handleCreateModalClose = () => {
        setIsCreateModalOpen(false);
    }


    return (
        <Authenticator>
            {({ signOut }) => (
                <Grid
                    container
                    className="App"
                    justifyContent="center"
                    alignItems="center"
                    direction="column"
                    spacing={4}
                >
                    <Grid><Typography level="h1">Magpie Supplies</Typography></Grid>
                    <Grid>
                        <IconButton onClick={() => setIsCreateModalOpen(true)}><AddBoxIcon/></IconButton>
                    </Grid>
                    <Grid><SupplyList supplies={supplies} deleteSupply={deleteSupply}/></Grid>
                    <Grid><Button onClick={signOut}>Sign Out</Button></Grid>

                    <CreateSupplyModal isOpen={isCreateModalOpen} handleClose={handleCreateModalClose}/>


                </Grid>
            )}
        </Authenticator>
    );
}