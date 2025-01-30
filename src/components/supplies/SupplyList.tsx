import * as React from 'react';
import {DataGrid, GridColDef, GridRowsProp} from '@mui/x-data-grid';
import {Button, IconButton} from "@mui/joy";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

interface IProps {
    supplies: ISupply[]
    deleteSupply: (supply:ISupply) => void;
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
    unit: string|null,
    width: number|null,
}


const SupplyList: React.FC<IProps> = (props:IProps) => {
    const {deleteSupply, supplies} = props;

    function getDeleteLink(supply: ISupply) {
        return (<Button onClick={() => deleteSupply(supply)}>Delete</Button>);
    }

    const rows: GridRowsProp = supplies.map((supply:ISupply) => {
        return {
            ...supply,
            gauge: supply.gauge ? `${supply.gauge}mm` : 'n/a',
            length: supply.length ? `${supply.length}mm` : 'n/a',
            width: supply.width ?`${supply.width}mm` : 'n/a',
            cost: `$${supply.cost}`,
            delete: getDeleteLink(supply)
        }
    });

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Name'},
        { field: 'type', headerName: 'Type'},
        { field: 'material', headerName: 'Material'},
        { field: 'unit', headerName: 'Unit'},
        { field: 'gauge', headerName: 'Gauge'},
        { field: 'length', headerName: 'Length'},
        { field: 'width', headerName: 'Width'},
        { field: 'image', headerName: 'Image'},
        { field: 'cost', headerName: 'Cost'},
        {
            field: 'action',
            headerName: 'Action',
            width: 180,
            sortable: false,

            renderCell: (params) => {
                const handleDelete = () => {
                    deleteSupply(params.row);
                };

                return (
                    <IconButton onClick={handleDelete} variant="soft">
                        <DeleteForeverIcon />
                    </IconButton>
                );
            },
        }
    ];

    return <DataGrid rows={rows} columns={columns} autosizeOnMount={true}/>;
}

export default SupplyList;