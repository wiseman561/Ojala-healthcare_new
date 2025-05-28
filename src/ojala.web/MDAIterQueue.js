      case 'low': return 'success';
      default: return 'default';
    }
  };

  return (
    <Card elevation={3}>
      <CardHeader 
        title="Patients Requiring MD Review" 
        subheader={`${sortedPatients.length} patients awaiting your review`}