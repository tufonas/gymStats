// import * as React from "react";
// import Typography from "@mui/material/Typography";
// import MuscleGroupItem from "./MuscleGroupItem";
//
// class MuscleGroupListItem extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {};
//   }
//
//   render() {
//     return (
//       <div>
//         <Typography sx={{marginLeft:2, textAlign:"center"}} variant="h5"
//         > {this.props.muscleGroup}</Typography>
//         {Object.values(
//           this.props.currentProgram.exercises[this.props.muscleGroup]
//         ).map((exercise, key) => (
//           <MuscleGroupItem
//             key={key}
//             chosenWeight={this.props.chosenWeight}
//             chosenProgram={Object.values(
//               this.props.currentProgram.exercises[this.props.muscleGroup]
//             ).pop()}
//             exerciseName={exercise.name}
//           />
//         ))}
//       </div>
//     );
//   }
// }
//
// export default MuscleGroupListItem;
