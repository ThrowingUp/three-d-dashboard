import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const preset = await request.json();
    
    // Validate the preset data
    if (!preset.experimentId || !preset.controls) {
      return NextResponse.json(
        { error: 'Invalid preset data. Missing experimentId or controls.' },
        { status: 400 }
      );
    }

    // In a real application, you would save this to a database
    // For now, we'll just log it and return success
    console.log('Saving preset for experiment:', preset.experimentId);
    console.log('Preset data:', preset);

    // You could implement database storage here:
    // await db.presets.create({
    //   data: {
    //     experimentId: preset.experimentId,
    //     controls: preset.controls,
    //     timestamp: preset.timestamp || new Date().toISOString(),
    //     userId: preset.userId, // if you have user authentication
    //   }
    // });

    return NextResponse.json({
      success: true,
      message: 'Preset saved successfully',
      id: `preset_${Date.now()}` // Mock ID
    });

  } catch (error) {
    console.error('Error saving preset:', error);
    return NextResponse.json(
      { error: 'Failed to save preset' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const experimentId = searchParams.get('experimentId');

    if (!experimentId) {
      return NextResponse.json(
        { error: 'experimentId parameter is required' },
        { status: 400 }
      );
    }

    // In a real application, you would fetch from a database
    // For now, return mock data
    const mockPresets = [
      {
        id: 'preset_1',
        experimentId,
        controls: {
          color: '#ff0066',
          gridSize: 15,
          lineWidth: 0.03,
          glowStrength: 3.0
        },
        timestamp: '2024-01-15T10:30:00Z',
        name: 'Pink Glow'
      },
      {
        id: 'preset_2',
        experimentId,
        controls: {
          color: '#00ff88',
          gridSize: 8,
          lineWidth: 0.01,
          glowStrength: 1.5
        },
        timestamp: '2024-01-14T15:45:00Z',
        name: 'Green Matrix'
      }
    ];

    return NextResponse.json({
      success: true,
      presets: mockPresets
    });

  } catch (error) {
    console.error('Error fetching presets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch presets' },
      { status: 500 }
    );
  }
}
