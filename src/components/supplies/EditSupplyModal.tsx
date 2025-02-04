import {Button, FormControl, FormLabel, Input, Dialog, DialogTitle, DialogContent, Grid2, styled, Divider} from '@mui/material';
import * as React from 'react';
import {uploadData} from "aws-amplify/storage";
import {generateClient} from "aws-amplify/api";
import type {Schema} from "../../../amplify/data/resource.ts";
import {ISupply} from "./SupplyList.tsx";
import {CloudUpload} from "@mui/icons-material";

interface IProps {
    isOpen: boolean;
    handleClose: () => void;
    supply: ISupply|undefined;

}

const client = generateClient<Schema>({
    authMode: "userPool",
});


// //TODO move this somewhere it can be shared
const VisuallyHiddenInput = styled('input')`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  white-space: nowrap;
  width: 1px;
`;

const EditSupplyModal:React.FC<IProps> = (props:IProps) => {
    const {isOpen, handleClose, supply} = props;
    const [name, setName] = React.useState<string|undefined>(supply?.name ?? undefined);
    const [type, setType] = React.useState<string|undefined>(supply?.type ?? undefined);
    const [units, setUnits] = React.useState<number|undefined>(supply?.units ?? undefined);
    const [material, setMaterial] = React.useState<string|undefined>(supply?.material ?? undefined);
    const [gauge, setGauge] = React.useState<number|undefined>(supply?.gauge ?? undefined);
    const [length, setLength] = React.useState<number|undefined>(supply?.length ?? undefined);
    const [width, setWidth] = React.useState<number|undefined>(supply?.width ?? undefined);
    const [cost, setCost] = React.useState<number|undefined>(supply?.cost ?? undefined);
    const [image, setImage] = React.useState<string|URL|undefined>(supply?.image ?? undefined);
    const [imageFile, setImageFile] = React.useState<File>();

    React.useEffect(() => {
        setName(supply?.name ?? undefined);
        setType(supply?.type ?? undefined);
        setUnits(supply?.units ?? undefined);
        setMaterial(supply?.material ?? undefined);
        setGauge(supply?.gauge ?? undefined);
        setLength(supply?.length ?? undefined);
        setWidth(supply?.width ?? undefined);
        setCost(supply?.cost ?? undefined);
        setImage(supply?.image ?? undefined);
    }, [supply]);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if(event.target.files) {
            setImageFile(event.target.files[0]);
        }
    }


    const updateSupply= async () => {
        if(supply?.id) {
            console.log('hey')
            const {data: updatedSupply} = await client.models.Supply.update({
                id: supply.id,
                cost,
                gauge,
                length,
                material,
                name,
                type,
                units,
                width,
                image: imageFile?.name,
            });
            if (updatedSupply?.image && imageFile) {
                 await uploadData({
                    path: ({identityId}) => `media/${identityId}/${updatedSupply.image}`,
                    data: imageFile,
                }).result;
            }

            handleClose();
        }

    }

    return (
            <Dialog
                open={isOpen}
                onClose={handleClose}
            >
                <DialogTitle>Edit {supply?.name}</DialogTitle>
                <DialogContent>
                    <Grid2 container spacing={3}>
                        <Grid2 size={6}>
                            <FormControl required>
                                <FormLabel>Name</FormLabel>
                                <Input
                                    name="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </FormControl>
                        </Grid2>
                        <Grid2 size={6}>
                            <FormControl required>
                                <FormLabel>Type</FormLabel>
                                <Input
                                    name="type"
                                    type="text"
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                />
                            </FormControl>
                        </Grid2>
                        <Grid2 size={6}>
                            <FormControl required>
                                <FormLabel>Units</FormLabel>
                                <Input
                                    name="units"
                                    type="number"
                                    value={units}
                                    onChange={(e) => setUnits(+e.target.value)}
                                />
                            </FormControl>
                        </Grid2>
                        <Grid2 size={6}>
                            <FormControl required>
                                <FormLabel>Material</FormLabel>
                                <Input
                                    name="material"
                                    type="text"
                                    value={material}
                                    onChange={(e) => setMaterial(e.target.value)}
                                />
                            </FormControl>
                        </Grid2>
                        <Grid2 size={6}>
                            <FormControl>
                                <FormLabel>Gauge</FormLabel>
                                <Input
                                    name="gauge"
                                    type="number"
                                    value={gauge}
                                    onChange={(e) => setGauge(+e.target.value)}
                                />
                            </FormControl>
                        </Grid2>
                        <Grid2 size={6}>
                            <FormControl required>
                                <FormLabel>Length</FormLabel>
                                <Input
                                    name="length"
                                    type="number"
                                    value={length}
                                    onChange={(e) => setLength(+e.target.value)}
                                />
                            </FormControl>
                        </Grid2>
                        <Grid2 size={6}>
                            <FormControl required>
                                <FormLabel>Width</FormLabel>
                                <Input
                                    name="width"
                                    type="number"
                                    value={width}
                                    onChange={(e) => setWidth(+e.target.value)}
                                />
                            </FormControl>
                        </Grid2>
                        <Grid2 size={6}>
                            <FormControl required>
                                <FormLabel>Cost</FormLabel>
                                <Input
                                    name="cost"
                                    type="number"
                                    value={cost}
                                    onChange={(e) => setCost(+e.target.value)}
                                />
                            </FormControl>
                        </Grid2>
                        <Grid2 size={12}>
                            <FormControl>
                                <FormLabel>Image</FormLabel>
                                <Button
                                    component="label"
                                    role={undefined}
                                    variant="contained"
                                    tabIndex={-1}
                                    startIcon={<CloudUpload />}
                                >
                                    Choose File
                                    <VisuallyHiddenInput
                                        type="file"
                                        onChange={handleImageChange}
                                        multiple
                                    />
                                </Button>
                                <img src={image as string} width={100}/>
                            </FormControl>
                        </Grid2>
                    </Grid2>
                    <Divider sx={{margin: '2em 0'}}/>
                    <Grid2 container sx={{
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={updateSupply} variant="contained">Submit</Button>
                    </Grid2>
                </DialogContent>
            </Dialog>
    )
};

export default EditSupplyModal;