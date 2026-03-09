async function testPropertyCreation() {
  const baseUrl = 'http://localhost:5001';

  try {
    // 1. Register Admin
    const email = `admin_${Date.now()}@test.com`;
    let res = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Admin User',
        email: email,
        password: 'password123',
        role: 'admin'
      })
    });
    
    if (!res.ok) throw new Error(await res.text());
    let data = await res.json();
    console.log('Registered admin:', data.email);
    const token = data.token;

    // 2. Create Property
    res = await fetch(`${baseUrl}/api/properties`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        title: 'Luxury Villa',
        description: 'A beautiful place',
        price: 2500,
        location: 'Miami',
        type: 'villa',
        images: ['http://example.com/img1.jpg'],
        amenities: ['Pool', 'WiFi'],
        bedrooms: 4,
        bathrooms: 3
      })
    });
    
    if (!res.ok) throw new Error(await res.text());
    data = await res.json();
    console.log('Property created: id is', data.id);
    const createdPropId = data.id;

    // 3. Get Properties
    res = await fetch(`${baseUrl}/api/properties`);
    if (!res.ok) throw new Error(await res.text());
    data = await res.json();
    console.log('List count:', data.length);
    console.log('Property belongs to:', data.find(p => p.id === createdPropId).title);

  } catch (error) {
    console.error('Test Failed:', error.message);
    process.exit(1);
  }
}

testPropertyCreation();
