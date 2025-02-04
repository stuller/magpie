import * as React from 'react';
import {DataGrid, GridColDef, GridRowsProp} from '@mui/x-data-grid';
import {Button, Grid2, IconButton, Typography} from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AddBoxIcon from "@mui/icons-material/AddBox";
import CreateSupplyModal from "./CreateSupplyModal.tsx";
import {useEffect, useState} from "react";
import {getUrl} from "aws-amplify/storage";
import {Edit} from "@mui/icons-material";
import EditSupplyModal from "./EditSupplyModal.tsx";

interface IProps {
    //@ts-ignore
    client: any; //todo figure out how to type this later
}

export interface ISupply {
    id: string|null,
    cost: number|null,
    gauge: number|null,
    image: string|URL|null,
    length: number|null,
    material: string|null,
    name: string|null,
    type: string|null,
    units: number|null,
    width: number|null,
}


const SupplyList: React.FC<IProps> = (props:IProps) => {
    const {client} = props;

    const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [supplies, setSupplies] = useState<ISupply[]>([]);
    const [supplyToEdit, setSupplyToEdit] = useState<ISupply>();
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            await fetchSupplies();
            setIsLoading(false);
        })()
    }, []);



    function getDeleteLink(supply: ISupply) {
        return (<Button onClick={() => deleteSupply(supply)}>Delete</Button>);
    }

    const handleCreateModalClose = async () => {
        setIsCreateModalOpen(false);
        await fetchSupplies();
    }

    const handleEditModalClose = async () => {
        setIsEditModalOpen(false);
        console.log('handling edit modal close')
        await fetchSupplies();
    }

    const deleteSupply = async (supply: ISupply)=> {
        const {id} = supply;
        if(id) {
            await client.models.Supply.delete({id});
            await fetchSupplies();
        }
    }

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

    const rows: GridRowsProp = supplies.map((supply:ISupply) => {
        return {
            ...supply,
            gauge: supply.gauge ? `${supply.gauge}-ga` : 'n/a',
            length: supply.length ? `${supply.length}mm` : 'n/a',
            width: supply.width ?`${supply.width}mm` : 'n/a',
            cost: `$${supply.cost}`,
            delete: getDeleteLink(supply)
        }
    });

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Name', width: 220},
        { field: 'image', headerName: 'Image',
            renderCell: (params) => {
                return (params.row.image && <img src={params.row.image} alt={`sample of ${params.row.name}`} width={50}/>)
            }
        },
        { field: 'type', headerName: 'Type'},
        { field: 'material', headerName: 'Material', width:150},
        { field: 'units', headerName: 'Units'},
        { field: 'gauge', headerName: 'Gauge'},
        { field: 'length', headerName: 'Length'},
        { field: 'width', headerName: 'Width'},
        { field: 'cost', headerName: 'Cost'},
        {
            field: 'action',
            headerName: 'Action',
            width: 180,
            sortable: false,

            renderCell: (params) => {
                const handleDelete = () => {
                    return deleteSupply(params.row);
                };
                const handleUpdate = () => {
                    setSupplyToEdit(supplies.find(s => s.id === params.row.id));
                    setIsEditModalOpen(true);
                }
                return (
                    <>
                        <IconButton onClick={handleDelete}>
                            <DeleteForeverIcon />
                        </IconButton>
                        <IconButton onClick={handleUpdate}>
                            <Edit />
                        </IconButton>
                    </>
                );
            },
        }
    ];

    return (
        <Grid2 container spacing={4} direction="column" size={12}>
            <Grid2><Typography variant="h2" component="h1">Supplies</Typography></Grid2>
            <Grid2>
                <IconButton onClick={() => setIsCreateModalOpen(true)}><AddBoxIcon/></IconButton>
                <Button variant="text" onClick={() => setIsCreateModalOpen(true)}>Add new supply</Button>
            </Grid2>
            <DataGrid loading={isLoading} rows={rows} columns={columns} autosizeOnMount={true}/>

            <CreateSupplyModal isOpen={isCreateModalOpen} handleClose={handleCreateModalClose}/>
            {supplyToEdit && <EditSupplyModal isOpen={isEditModalOpen} handleClose={handleEditModalClose} supply={supplyToEdit}/>}
        </Grid2>
    );
}

export default SupplyList;