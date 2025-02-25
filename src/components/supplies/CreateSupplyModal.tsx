import {Button, FormControl, FormLabel, Input, Dialog, DialogTitle, DialogContent, Grid2, Divider} from '@mui/material';
import * as React from 'react';
import {uploadData} from "aws-amplify/storage";
import {generateClient} from "aws-amplify/api";
import type {Schema} from "../../../amplify/data/resource.ts";
import {CloudUpload} from "@mui/icons-material";
import {VisuallyHiddenInput} from "../../utils/image-utils.ts";

interface IProps {
    isOpen: boolean;
    handleClose: () => void;
}

const client = generateClient<Schema>({
    authMode: "userPool",
});


const CreateSupplyModal:React.FC<IProps> = (props:IProps) => {
    const {isOpen, handleClose} = props;
    const [name, setName] = React.useState<string>('');
    const [type, setType] = React.useState<string>('');
    const [units, setUnits] = React.useState<number>();
    const [material, setMaterial] = React.useState<string>('');
    const [gauge, setGauge] = React.useState<number>();
    const [length, setLength] = React.useState<number>();
    const [width, setWidth] = React.useState<number>();
    const [cost, setCost] = React.useState<number>();
    const [image, setImage] = React.useState<File>();

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if(event.target.files) {
            setImage(event.target.files[0]);
        }
    }


    const createSupply= async () => {
        const {data: newSupply} = await client.models.Supply.create({
            cost,
            gauge,
            length,
            material,
            name,
            type,
            units,
            width,
            image: image?.name ?? null,
        });
        if (newSupply?.image && image) {
            await uploadData({
                path: ({identityId}) => `media/${identityId}/${newSupply.image}`,
                data: image ?? null,
            }).result;
        }

        handleClose();
    }

    return (
            <Dialog
                open={isOpen}
                onClose={handleClose}
            >
                <DialogTitle>Create New Supply</DialogTitle>
                <DialogContent>
                    <Grid2 container spacing={3}>
                        <Grid2 size={6}>
                            <FormControl required>
                                <FormLabel>Name</FormLabel>
                                <Input
                                    name="name"
                                    type="text"
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
                                    onChange={(e) => setType(e.target.value)}
                                />
                            </FormControl>
                        </Grid2>
                        <Grid2 size={6}>
                            <FormControl required>
                                <FormLabel>Units</FormLabel>
                                <Input
                                    name="unit"
                                    type="number"
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
                            </FormControl>
                        </Grid2>
                    </Grid2>
                    <Divider sx={{margin: '2em 0'}}/>
                    <Grid2 container sx={{
                        justifyContent: "space-between",
                        alignItems: "center"
                    }}>
                        <Button onClick={handleClose}>Cancel</Button>
                        <Button onClick={createSupply} variant="contained">Submit</Button>
                    </Grid2>
                </DialogContent>
            </Dialog>
    )
};

export default CreateSupplyModal;